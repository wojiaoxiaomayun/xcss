<template>
  <Dialog v-model:visible="visible" maximizable modal header="设置" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <Accordion :multiple="true" :activeIndex="[0]">
      <AccordionTab header="Rules">
        <!-- <DataTable :value="products">
            <Column field="regex" header="Regex"></Column>
            <Column field="function" header="Function"></Column>
        </DataTable> -->
      </AccordionTab>
      <AccordionTab>
        <template #header>
            <span class="flex-gap-2 align-center justify-between w-100%">
                <span class="font-bold white-space-nowrap">Theme(主题色)</span>
                <Button class="w-24 h-24 padding-0 relative" icon="pi pi-plus-circle" size="small" severity="success" text raised rounded @click.capture.stop="toggleAdd('Theme')"/>
            </span>
        </template>
        <DataTable v-model:editingRows="themeEditRows"  :value="themeStore.theme" editMode="row" @row-edit-save="themeRowEditSave">
            <Column field="name" header="Key">
              <template #editor="{ data, field }">
                  <InputText type="text" v-model="data[field]" />
              </template>
            </Column>
            <Column field="color" header="Color">
              <template #editor="{ data, field }">
                  <InputText type="text" v-model="data[field]" />
              </template>
            </Column>
            <Column :rowEditor="true"  header="Edit" style="width: 10%; min-width: 8rem">
            </Column>
            <Column  header="Delete">
              <template #body="{ data, field,index }">
                <Button class="w-24 h-24 padding-0" icon="pi pi-times" size="small" severity="danger" text raised rounded @click="deleteRow($event,index,'theme')"/>
              </template>
            </Column>
        </DataTable>
      </AccordionTab>
      <AccordionTab header="PseudoClass(伪类)">
          <p class="m-0">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
              culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
          </p>
      </AccordionTab>
      <AccordionTab header="Responsive(响应式)">
          <p class="m-0">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
              culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
          </p>
      </AccordionTab>
    </Accordion>
    <ConfirmPopup></ConfirmPopup>
  </Dialog>
  <Dialog v-model:visible="addVisible" :header="addHeader" modal :style="{ width: '20rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div class="w-100% h-auto overflow-h flex-c-gap-8 padding-tb-8 align-end">
      <InputText class="w-100%" type="text" v-model="addForm.key" placeholder="请输入Key"/>
      <InputText class="w-100%" type="text" v-model="addForm.value" placeholder="请输入Color"/>
      <Button class="flex justify-center float-right margin-r-4">确定</Button>
    </div>
  </Dialog>
</template>
<script setup>
  import Dialog from 'primevue/dialog';
  import Accordion from 'primevue/accordion';
  import AccordionTab from 'primevue/accordiontab';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import ConfirmPopup from 'primevue/confirmpopup';

  
  import {ref,defineExpose, watch} from 'vue';
  import {useSettingStore} from '../store/SettingStore'
  
  let visible = ref(false);
  let addVisible = ref(false);
  let addHeader = ref('新增')
  let addForm = ref({
    key:'',
    value:'',
    type:''
  })
  function toggle(){
    visible.value = !visible.value;
  }
  function toggleAdd(type){
    addVisible.value = true
    addForm.value.type = type
    addHeader.value = `新增${type}`
  }
  
  import { useConfirm } from "primevue/useconfirm";
  const themeEditRows = ref([])
  let themeStore = useSettingStore();
  function themeRowEditSave(event){
    let { newData, index } = event;
    themeStore.changeTheme(index,newData)
  }
  const confirm = useConfirm()
  function deleteRow(event,index,type){
    confirm.require({
        target: event.currentTarget || event.target,
        message: '你确定删除当前配置么',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          switch(type){
            case 'theme':
              themeStore.deleteTheme(index)
              break;
            default:
              break;
          }
        },
        reject: () => {
            
        }
    });
    event.stopPropagation();
};
  

  defineExpose({toggle})
</script>