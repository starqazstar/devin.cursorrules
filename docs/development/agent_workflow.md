市面上的AI使用对比
prompt：
# 第一步：
给物料列表
这是我所有的物料名称 
[
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
# 第二步：给示例Scheme
现在我给你一个示例：
{
  "componentName": "Page",
  "id": "node_ocm7lmzei81",
  "props": {},
  "hidden": false,
  "title": "页面",
  "isLocked": false,
  "condition": true,
  "fileName": "/",
  "conditionGroup": "",
  "i18n": {
    "zh-CN": {
      "hello": "你好"
    },
    "en-US": {
      "hello": "hello"
    }
  },
  "children": [
    {
      "componentName": "FormilyForm",
      "id": "node_ocm88i3hy21",
      "props": {
        "labelCol": 3,
        "wrapperCol": 14,
        "layout": "inline",
        "width": "100%",
        "tableData": {
          "type": "JSExpression",
          "value": "this.data"
        },
        "size": "middle",
        "colon": false,
        "clearLabelSpace": false,
        "emitEventName": "",
        "initFetch": false,
        "broadcast": true
      },
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": "",
      "children": [
        {
          "componentName": "FormilyInput",
          "id": "node_ocm88i3hy22",
          "props": {
            "showLabel": true,
            "label": "姓名",
            "required": false,
            "name": "name",
            "defaultValue": ""
          },
          "hidden": false,
          "title": "",
          "isLocked": false,
          "condition": true,
          "conditionGroup": ""
        }
      ]
    }
  ]
}

# 第三步：提出生成诉求
根据示例，生成一个页面scheme     

我要一个页面，有表单，表单中有姓名、年龄、性别、爱好、住址、是否婚配 有表格，表格有预览数据
