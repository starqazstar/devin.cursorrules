import { PageSchema } from '../interfaces/lowcode';

export const exampleSchema: PageSchema = {
  type: 'Page',
  title: '用户信息管理',
  components: [
    {
      type: 'FormilyForm',
      props: {
        labelCol: 6,
        wrapperCol: 18
      },
      children: [
        {
          type: 'FormilyInput',
          props: {
            name: 'name',
            title: '姓名',
            required: true
          }
        },
        {
          type: 'FormilyInputNumber',
          props: {
            name: 'age',
            title: '年龄',
            required: true,
            min: 0,
            max: 120
          }
        },
        {
          type: 'FormRadio',
          props: {
            name: 'gender',
            title: '性别',
            required: true,
            options: [
              { label: '男', value: 'male' },
              { label: '女', value: 'female' }
            ]
          }
        },
        {
          type: 'FormCheckbox',
          props: {
            name: 'hobbies',
            title: '爱好',
            options: [
              { label: '阅读', value: 'reading' },
              { label: '运动', value: 'sports' },
              { label: '音乐', value: 'music' },
              { label: '旅行', value: 'travel' }
            ]
          }
        },
        {
          type: 'FormTextarea',
          props: {
            name: 'address',
            title: '住址',
            required: true
          }
        },
        {
          type: 'FormilySwitch',
          props: {
            name: 'isMarried',
            title: '是否婚配',
            defaultChecked: false
          }
        }
      ]
    },
    {
      type: 'FormilyTable',
      props: {
        title: '用户信息预览',
        columns: [
          { title: '姓名', dataIndex: 'name' },
          { title: '年龄', dataIndex: 'age' },
          { title: '性别', dataIndex: 'gender' },
          { title: '爱好', dataIndex: 'hobbies' },
          { title: '住址', dataIndex: 'address' },
          { title: '婚配状态', dataIndex: 'isMarried' }
        ],
        dataSource: [
          {
            name: '张三',
            age: 28,
            gender: '男',
            hobbies: ['阅读', '运动'],
            address: '北京市朝阳区',
            isMarried: true
          },
          {
            name: '李四',
            age: 25,
            gender: '女',
            hobbies: ['音乐', '旅行'],
            address: '上海市浦东新区',
            isMarried: false
          }
        ]
      }
    }
  ],
  dataSource: {
    type: 'static',
    data: {
      formData: {},
      tableData: []
    }
  }
}; 