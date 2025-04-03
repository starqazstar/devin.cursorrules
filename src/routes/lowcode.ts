import { Router } from 'express';
import { validateSlots } from '../middleware/slotValidator';
import { LowCodeService } from '../services/LowCodeService';
import { ErrorCode } from '../interfaces/lowcode';

const router = Router();
const lowCodeService = new LowCodeService();

// 生成页面 Schema
router.post('/generate', validateSlots, async (req, res) => {
  try {
    const { description, components } = req.body;

    if (!description || !components) {
      return res.status(400).json({
        success: false,
        error: {
          code: ErrorCode.INVALID_REQUEST,
          message: '缺少必要参数',
          timestamp: Date.now(),
          requestId: req.requestId
        }
      });
    }

    const result = await lowCodeService.generatePageSchema({
      description,
      components
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(`[${req.requestId}] 生成页面 Schema 失败:`, error);
    res.status(500).json({
      success: false,
      error: {
        code: ErrorCode.GENERATION_FAILED,
        message: error instanceof Error ? error.message : '生成页面 Schema 失败',
        timestamp: Date.now(),
        requestId: req.requestId
      }
    });
  }
});

// 优化页面 Schema
router.post('/optimize', validateSlots, async (req, res) => {
  try {
    const { schema, componentName } = req.body;

    if (!schema || !componentName) {
      return res.status(400).json({
        success: false,
        error: {
          code: ErrorCode.INVALID_REQUEST,
          message: '缺少必要参数',
          timestamp: Date.now(),
          requestId: req.requestId
        }
      });
    }

    const result = await lowCodeService.optimizeSchema(schema, componentName);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(`[${req.requestId}] 优化页面 Schema 失败:`, error);
    res.status(500).json({
      success: false,
      error: {
        code: ErrorCode.GENERATION_FAILED,
        message: error instanceof Error ? error.message : '优化页面 Schema 失败',
        timestamp: Date.now(),
        requestId: req.requestId
      }
    });
  }
});

// 验证页面 Schema
router.post('/validate', validateSlots, async (req, res) => {
  try {
    const { schema, materials } = req.body;

    if (!schema || !materials) {
      return res.status(400).json({
        success: false,
        error: {
          code: ErrorCode.INVALID_REQUEST,
          message: '缺少必要参数',
          timestamp: Date.now(),
          requestId: req.requestId
        }
      });
    }

    const result = await lowCodeService.validateSchema(schema, materials);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(`[${req.requestId}] 验证页面 Schema 失败:`, error);
    res.status(500).json({
      success: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: error instanceof Error ? error.message : '验证页面 Schema 失败',
        timestamp: Date.now(),
        requestId: req.requestId
      }
    });
  }
});

export default router; 