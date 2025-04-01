import React, { useState } from 'react';
import { Layout, Card, Input, Button, Space, message, Tabs, Select } from 'antd';
import { LowCodeService } from '../services/LowCodeService';
import type { MaterialList, PageGenerationRequest } from '../interfaces/lowcode';
import ReactJson from 'react-json-view';

const { Header, Content } = Layout;
const { TextArea } = Input;
const { TabPane } = Tabs;

// 测试用例
const TEST_CASES = [
  {
    name: '员工信息表单',
    description: '创建一个员工信息录入表单，需要包含：姓名（必填）、年龄（必填，数字）、性别（单选）、部门（下拉选择）、入职日期（日期选择）、工作经验（年）、个人简介（多行文本）、技能标签（多选）、是否全职（开关）'
  },
  {
    name: '项目管理系统',
    description: '创建一个项目管理页面，包含：1. 项目列表（表格展示：项目名称、负责人、开始日期、结束日期、状态、进度）；2. 搜索区域（支持按项目名称、负责人、状态筛选）；3. 操作区（新建项目按钮）；4. 表格操作列（查看详情、编辑、删除）'
  },
  {
    name: '系统设置',
    description: '创建一个系统设置页面，使用选项卡布局，包含：1. 基本设置（系统名称、Logo上传、主题色选择）；2. 通知设置（邮件通知开关、消息推送开关、提醒时间选择）；3. 权限设置（用户权限多选、角色权限配置）'
  }
];

const Demo: React.FC = () => {
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  // 所有可用组件列表
  const availableComponents = [
    'Form',
    'Input',
    'InputNumber',
    'Select',
    'Button',
    'Table',
    'DatePicker',
    'TimePicker',
    'Upload',
    'Modal',
    'Tabs',
    'Card',
    'List',
    'Tree',
    'Menu',
    'Layout',
    'Space',
    'Divider',
    'Typography',
    'Radio',
    'Checkbox',
    'Switch',
    'Slider',
    'Rate',
    'Cascader',
    'Transfer',
    'Calendar',
    'Image',
    'Progress',
    'Alert',
    'Spin',
    'Tag',
    'Avatar',
    'Badge',
    'Popover',
    'Tooltip',
    'Steps'
  ];

  const handleGenerate = async () => {
    if (!description) {
      message.error('请输入页面描述');
      return;
    }

    setLoading(true);

    try {
      const service = new LowCodeService();
      const request: PageGenerationRequest = {
        description,
        components: availableComponents
      };

      const response = await service.getFinalSchema(request);
      
      if (response.success && response.data) {
        setResult(response.data);
        message.success('生成成功');
      } else {
        console.error('生成失败:', response.error);
        message.error(response.error?.message || '生成失败，请检查控制台了解详情');
      }
    } catch (error) {
      console.error('生成失败:', error);
      message.error('生成失败，请检查控制台了解详情');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setDescription('');
    setResult(null);
  };

  const handleTestCase = (testCase: typeof TEST_CASES[0]) => {
    setDescription(testCase.description);
  };

  return (
    <Layout className="layout">
      <Header style={{ background: '#fff', padding: '0 20px' }}>
        <h1>低代码平台演示</h1>
      </Header>
      <Content style={{ padding: '20px' }}>
        <Tabs defaultActiveKey="editor">
          <TabPane tab="编辑器" key="editor">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card title="测试用例">
                <Space wrap>
                  {TEST_CASES.map((testCase, index) => (
                    <Button key={index} onClick={() => handleTestCase(testCase)}>
                      {testCase.name}
                    </Button>
                  ))}
                </Space>
              </Card>
              <Card title="页面配置">
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <div>
                    <h3>页面描述</h3>
                    <TextArea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="请输入页面功能描述，例如：
1. 创建一个用户信息录入表单，包含姓名、年龄、性别、邮箱等字段
2. 创建一个项目管理列表页面，显示项目名称、状态、创建时间等信息
3. 创建一个数据统计看板，展示各类指标和图表"
                      rows={6}
                    />
                  </div>
                  <Space>
                    <Button type="primary" onClick={handleGenerate} loading={loading}>
                      生成页面
                    </Button>
                    <Button onClick={handleClear}>清空</Button>
                  </Space>
                </Space>
              </Card>
            </Space>
          </TabPane>
          <TabPane tab="预览" key="preview">
            <Card title="生成结果">
              {result ? (
                <ReactJson src={result} theme="monokai" />
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  暂无生成结果
                </div>
              )}
            </Card>
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default Demo; 