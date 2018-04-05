<template>
  <div class="class-info-container">
    <div class="operation-bar clearfix" style="margin-bottom: 15px">
      <Button class="right" type="success">管理班级用户</Button>
      <Button class="right" type="primary" style="margin-right: 15px" @click="addHomeworkModal = true">添加作业</Button>
    </div>
    <div class="row">
      <div class="col-sm-6 col-lg-3">
        <b-card class="text-white bg-success">
          <div class="h4 m-0">89.9%</div>
          <div>Lorem ipsum...</div>
          <b-progress class="progress-white progress-xs my-3" :value="25"/>
          <small class="text-muted">Lorem ipsum dolor sit amet enim.</small>
        </b-card>
      </div><!--/.col-->
      <div class="col-sm-6 col-lg-3">
        <b-card class="text-white bg-primary">
          <div class="h4 m-0">12.124</div>
          <div>Lorem ipsum...</div>
          <b-progress class="progress-white progress-xs my-3" :value="25"/>
          <small class="text-muted">Lorem ipsum dolor sit amet enim.</small>
        </b-card>
      </div><!--/.col-->
      <div class="col-sm-6 col-lg-3">
        <b-card class="text-white bg-gray">
          <div class="h4 m-0">$98.111,00</div>
          <div>Lorem ipsum...</div>
          <b-progress class="progress-white progress-xs my-3" :value="25"/>
          <small class="text-muted">Lorem ipsum dolor sit amet enim.</small>
        </b-card>
      </div><!--/.col-->
    </div>
    <Modal
      v-model="addHomeworkModal"
      title="添加class">
      <Form ref="addHomeworkForm" :model="addHomeworkForm" :rules="addHomeworkRules" :label-width="90">
        <FormItem label="作业名" prop="name">
          <Input v-model="addHomeworkForm.name"></Input>
        </FormItem>
        <FormItem label="时间范围" prop="daterange">
          <DatePicker type="daterange" v-model="addHomeworkForm.daterange" placeholder="请选择一个时间范围..." style="width: 300px"></DatePicker>
        </FormItem>
        <FormItem label="作业描述" prop="description">
          <Input type="textarea" :rows="15" v-model="addHomeworkForm.description"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button :loading="false" @click="addHomeworkModal = false">返回</Button>
        <Button type="primary" :loading="addingHomework" @click="addHomework">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { AddHomework } from '@/api/homework'
  export default {
    name: 'ClassInfo',
    data() {
      const validateName = (rule, value, callback) => {
        if (value.length === 0 || value.length > 48) {
          callback(new Error('作业名应包含1~48个字符'));
        } else {
          callback();
        }
      };

      const validateDaterange = (rule, value, callback) => {
        console.log('value', value);
        if (value.length !== 2 || !value[0] || !value[1]) {
          callback(new Error('请输入时间范围'));
        } else {
          callback();
        }
      };

      const validateDescription = (rule, value, callback) => {
        if (value.length === 0 || value.length > 2000) {
          callback(new Error('作业描述应包含1~2000个字符'));
        } else {
          callback();
        }
      };

      return {
        addHomeworkModal: false,
        addingHomework: false,
        addHomeworkForm: {
          name: '',
          description: '',
          daterange: []
        },
        addHomeworkRules: {
          name: [
            { require: true, validator: validateName }
          ],
          daterange: [
            { require: true, validator: validateDaterange }
          ],
          description: [
            { require: true, validator: validateDescription }
          ]
        },
        homeworkList: []
      }
    },
    methods: {
      addHomework() {
        this.$refs.addHomeworkForm.validate(valid => {
          if (valid) {
            this.addingHomework = true;
            const homeworkData = {
              name: this.addHomeworkForm.name,
              description: this.addHomeworkForm.description,
              classId: this.$route.params.classId,
              startTime: this.addHomeworkForm.daterange[0],
              endTime: this.addHomeworkForm.daterange[1]
            };
            console.log('homeworkData', homeworkData);
            AddHomework(homeworkData).then(res => {
              if (res.data.code === 0) {
                this.addingHomework = false;
                this.addHomeworkModal = false;
                console.log('date', new Date()); // TODO: 最好将date格式化，另外注意时区的不同
                console.log('res.data.homework', res.data.homework);
                this.homeworkList.unshift(res.data.homework);
                this.$Message.success('创建作业成功');
              }
            }).catch(err => {
              console.error(err);
            })
          } else {
            this.$Message.error('输入不正确，请检查');
          }
        });
      }
    }
  }
</script>

<style scoped>
  .bg-gray {
    background-color: #869fac;
    border: 1px solid #536c79;
  }

  .class-info-container {
    background-color: white;
    padding: 18px;
  }

  .operation-bar {

  }
</style>
