<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <div slot="header"></div>
      <ul class="nav">
        <li class="nav-item" v-if="role !== 'admin'">
          <li class="nav-title">
            class列表
            <span @click="addClassModal = true" v-if="role === 'teacher'">
              <b-badge variant="primary" class="add-class-button right">添加class</b-badge>
            </span>
          </li>
        </li>
        <li class="nav-item" v-for="(item, index) in classListNav">
          <template v-if="item.title">
            <SidebarNavTitle :name="item.name"/>
          </template>
          <template v-else-if="item.divider">
            <li class="divider"></li>
          </template>
          <template v-else>
            <template v-if="item.children">
              <SidebarNavDropdown :name="item.name" :url="item.url" :icon="item.icon">
                <template v-for="(child, index) in item.children">
                  <template v-if="child.children">
                    <SidebarNavDropdown :name="child.name" :url="child.url" :icon="child.icon">
                      <li class="nav-item" v-for="(child, index) in item.children">
                        <SidebarNavLink :name="child.name" :url="child.url" :icon="child.icon" :badge="child.badge"/>
                      </li>
                    </SidebarNavDropdown>
                  </template>
                  <template v-else>
                    <li class="nav-item">
                      <SidebarNavLink :name="child.name" :url="child.url" :icon="child.icon" :badge="child.badge"/>
                    </li>
                  </template>
                </template>
              </SidebarNavDropdown>
            </template>
            <template v-else>
              <SidebarNavLink :name="item.name" :url="item.url" :icon="item.icon" :badge="item.badge"/>
            </template>
          </template>
        </li>
      </ul>
      <slot></slot>
      <div slot="footer"></div>
    </nav>
    <Modal
      v-model="addClassModal"
      title="添加class">
      <Form ref="addClassForm" :model="addClassForm" :rules="addClassRules" :label-width="90">
        <FormItem label="班名" prop="name">
          <Input v-model="addClassForm.name"></Input>
        </FormItem>
        <FormItem label="任课老师姓名" prop="teacherName">
          <Input v-model="addClassForm.teacherName"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="addClassModal = false">返回</Button>
        <Button type="primary" :loading="addingClass" @click="addClass">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import SidebarNavDropdown from './SidebarNavDropdown'
import SidebarNavLink from './SidebarNavLink'
import SidebarNavTitle from './SidebarNavTitle'
import { mapGetters } from 'vuex'
import { AddClass, GetClassList } from '@/api/class'
export default {
  name: 'sidebar',
  props: {
    navItems: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  components: {
    SidebarNavDropdown,
    SidebarNavLink,
    SidebarNavTitle
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (value.length === 0 || value.length > 128) {
        callback(new Error('班名应包含1~128个字符'));
      } else {
        callback();
      }
    };

    const validateTeacherName = (rule, value, callback) => {
      if (value.length === 0 || value.length > 48) {
        callback(new Error('班名应包含1~48个字符'));
      } else {
        callback();
      }
    };

    return {
      addClassModal: false,
      addingClass: false,
      classList: [],
      addClassForm: {
        name: '',
        teacherName: ''
      },
      addClassRules: {
        name: [
          { require: true, validator: validateName }
        ],
        teacherName: [
          { require: true, validator: validateTeacherName }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['role']),
    classListNav() {
      return this.classList.map(data => {
        return {
          name: data.name,
          url: '/classInfo/' + data.id,
          icon: 'icon-star'
        }
      });
    }
  },
  mounted() {
    GetClassList().then(res => {
      if (res.data.code === 0) {
        this.classList = res.data.classList;
        console.log('this.classList', this.classList);
      }
    }).catch(err => {
      console.error(err);
    });
  },
  methods: {
    handleClick (e) {
      e.preventDefault()
      e.target.parentElement.classList.toggle('open')
    },

    addClass() {
      this.$refs.addClassForm.validate(valid => {
        if (valid) {
          this.addingClass = true;
          AddClass(this.addClassForm).then(res => {
            if (res.data.code === 0) {
              console.log('res.data.classData', res.data.classData);
              this.classList.push(res.data.classData);
              this.addingClass = false;
              this.addClassModal = false;
              this.$Message.success('创建class成功');
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

<style lang="css">
  .nav-link {
    cursor:pointer;
  }

  .add-class-button {
    cursor: pointer;
    padding: 4px 7px;
  }
</style>
