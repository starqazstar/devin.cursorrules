"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LowCodeService_1 = require("../services/LowCodeService");
async function test() {
    try {
        // 创建服务实例
        const service = new LowCodeService_1.LowCodeService();
        // 准备测试数据
        const materials = {
            materials: [
                "BusinessSlot",
                "AConfigProvider",
                "FlexContainer",
                "HtmlSlot",
                "RequestContainer",
                "FormilyTag",
                "FormilyTable",
                "TableMenu",
                "TableSearchForm",
                "TableSwitch",
                "FormilyChildFormList",
                "EnumConfig",
                "FormilyForm",
                "FormilyButton",
                "FormilyFormModal",
                "FormilyFormModalNew",
                "FormCascader",
                "FormCheckbox",
                "FormilyContainer",
                "FormilyDatePicker",
                "FormilyInput",
                "FormilyInputNumber",
                "FormilyFormList",
                "FormRadio",
                "FormRangePicker",
                "FormSelect",
                "FormSlider",
                "FormilyFormSpace",
                "FormilySwitch",
                "FormilyTabs",
                "FormText",
                "FormTextarea",
                "FormilyUpload",
                "LcAudio",
                "FormilyPage",
                "PreConfig"
            ]
        };
        const request = {
            materials,
            description: '创建一个用户管理页面，包含用户信息表单（姓名、年龄、性别、部门、职位、入职日期）和用户列表表格，支持查询和编辑功能'
        };
        console.log('开始测试页面生成...');
        console.log('请求参数:', JSON.stringify(request, null, 2));
        // 调用生成服务
        const response = await service.generatePageSchema(request);
        if (response.success && response.data) {
            console.log('页面生成成功！');
            console.log('生成的 Schema:', JSON.stringify(response.data, null, 2));
        }
        else {
            console.error('页面生成失败:', response.error);
        }
    }
    catch (error) {
        console.error('测试过程中发生错误:', error);
    }
}
// 运行测试
test().catch(console.error);
