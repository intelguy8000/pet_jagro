import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  searchProducts,
  getProductStock,
  searchOrders,
  getOrderDetails,
  getMessengerInfo,
  getLiquidationSummary,
  createOrder,
  getLowStockProducts
} from '@/lib/ai-functions';

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY
});

// Definición de funciones disponibles para el AI
const functions = [
  {
    name: 'searchProducts',
    description: 'Buscar productos por nombre, categoría o código de barras',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Texto a buscar en productos (nombre, categoría o código)'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'getProductStock',
    description: 'Obtener el stock de un producto específico',
    parameters: {
      type: 'object',
      properties: {
        productName: {
          type: 'string',
          description: 'Nombre del producto'
        }
      },
      required: ['productName']
    }
  },
  {
    name: 'searchOrders',
    description: 'Buscar pedidos por cliente, estado o número de pedido',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Texto a buscar (nombre de cliente, estado o número de pedido)'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'getOrderDetails',
    description: 'Obtener todos los detalles completos de un pedido específico (items, precios, cliente, etc)',
    parameters: {
      type: 'object',
      properties: {
        orderNumber: {
          type: 'string',
          description: 'Número del pedido (ej: PED-2025-001)'
        }
      },
      required: ['orderNumber']
    }
  },
  {
    name: 'getMessengerInfo',
    description: 'Obtener información de un mensajero o listar todos',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Nombre del mensajero (opcional, si no se provee lista todos)'
        }
      }
    }
  },
  {
    name: 'getLiquidationSummary',
    description: 'Obtener resumen de liquidaciones y entregas',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'createOrder',
    description: 'Crear un nuevo pedido (experimental)',
    parameters: {
      type: 'object',
      properties: {
        customerName: {
          type: 'string',
          description: 'Nombre del cliente'
        },
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Nombre del producto'
              },
              quantity: {
                type: 'number',
                description: 'Cantidad a ordenar'
              }
            },
            required: ['name', 'quantity']
          },
          description: 'Lista de productos con sus cantidades'
        }
      },
      required: ['customerName', 'products']
    }
  },
  {
    name: 'getLowStockProducts',
    description: 'Obtener lista de productos con stock bajo o agotados',
    parameters: {
      type: 'object',
      properties: {}
    }
  }
];

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // System message para configurar el comportamiento del AI
    const systemMessage = {
      role: 'system',
      content: `Eres un asistente virtual para el sistema de picking de J Agro (tienda de mascotas).

Tu objetivo es ayudar con consultas sobre:
- Productos e inventario
- Pedidos y su estado (con todos los detalles: items, precios, lotes, etc)
- Mensajeros y entregas
- Liquidaciones y pagos
- Crear pedidos nuevos

Funciones disponibles:
- searchOrders: Para buscar pedidos (lista básica)
- getOrderDetails: Para ver TODOS los detalles de un pedido específico (úsala cuando pidan detalles, items, productos)
- searchProducts: Buscar productos
- getProductStock: Stock de un producto
- getMessengerInfo: Info de mensajeros
- getLiquidationSummary: Resumen de liquidaciones
- getLowStockProducts: Productos bajos
- createOrder: Crear pedidos

Reglas importantes:
1. Responde de forma CONCISA (máximo 15 palabras cuando sea posible, pero usa más si hay múltiples items)
2. Si preguntan por DETALLES, ITEMS o PRODUCTOS de un pedido, SIEMPRE usa getOrderDetails
3. Si necesitas información, usa las funciones disponibles
4. Se directo y claro
5. Usa español
6. Si creas un pedido, confirma los detalles primero`
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, ...messages],
      functions: functions,
      function_call: 'auto',
      temperature: 0.7,
      max_tokens: 150
    });

    const responseMessage = completion.choices[0].message;

    // Si el AI quiere ejecutar una función
    if (responseMessage.function_call) {
      const functionName = responseMessage.function_call.name;
      const functionArgs = JSON.parse(responseMessage.function_call.arguments);

      let functionResult;

      // Ejecutar la función correspondiente
      switch (functionName) {
        case 'searchProducts':
          functionResult = searchProducts(functionArgs.query);
          break;
        case 'getProductStock':
          functionResult = getProductStock(functionArgs.productName);
          break;
        case 'searchOrders':
          functionResult = searchOrders(functionArgs.query);
          break;
        case 'getOrderDetails':
          functionResult = getOrderDetails(functionArgs.orderNumber);
          break;
        case 'getMessengerInfo':
          functionResult = getMessengerInfo(functionArgs.name);
          break;
        case 'getLiquidationSummary':
          functionResult = getLiquidationSummary();
          break;
        case 'createOrder':
          functionResult = createOrder(functionArgs.customerName, functionArgs.products);
          break;
        case 'getLowStockProducts':
          functionResult = getLowStockProducts();
          break;
        default:
          functionResult = { success: false, message: 'Función no reconocida' };
      }

      // Enviar el resultado de la función al AI para que genere una respuesta
      const secondCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          systemMessage,
          ...messages,
          responseMessage,
          {
            role: 'function',
            name: functionName,
            content: JSON.stringify(functionResult)
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      const finalMessage = secondCompletion.choices[0].message.content;

      return NextResponse.json({ message: finalMessage });
    }

    // Si no hay función, retornar la respuesta directa
    return NextResponse.json({ message: responseMessage.content });

  } catch (error) {
    console.error('Error en API de chat:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
