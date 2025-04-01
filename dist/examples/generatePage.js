"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LowCodeService_1 = require("../services/LowCodeService");
async function main() {
    // 创建低代码服务实例
    const lowCodeService = new LowCodeService_1.LowCodeService();
    // 准备物料列表
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
    // 准备生成请求
    const request = {
        materials,
        description: '我要一个页面，有表单，表单中有姓名、年龄、性别、爱好、住址、是否婚配 有表格，表格有预览数据'
    };
    try {
        // 调用生成服务
        console.log('开始生成页面...');
        const response = await lowCodeService.generatePageSchema(request);
        if (response.success && response.data) {
            console.log('页面生成成功：');
            console.log(JSON.stringify(response.data, null, 2));
        }
        else {
            console.error('页面生成失败：', response.error);
        }
    }
    catch (error) {
        console.error('发生错误：', error);
    }
}
// 运行示例
main().catch(console.error);
