<template>
  <Dialog v-model:visible="visible" maximizable modal header="设置" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <Accordion :multiple="true" :activeIndex="[0]">
      <AccordionTab>
        <template #header>
            <span class="flex gap-2 align-center justify-between w-100%">
                <div class="flex gap-8 align-center">
                  <span class="font-bold white-space-nowrap">Rules</span>
                  <i @click.capture.stop="showTipInfo('rule')" class="pi pi-info-circle"></i>
                </div>
                <Button class="w-24 h-24 padding-0 relative" icon="pi pi-plus-circle" size="small" severity="success" text raised rounded @click.capture.stop="toggleAdd('rule')"/>
            </span>
        </template>
        <DataTable v-model:editingRows="rulesEditRows"  :value="rulesStore.rules" editMode="row" @row-edit-save="rowEditSave($event,'rule')">
            <Column field="name" header="Regexp">
              <template #editor="{ data, field }">
                  <InputText type="text" v-model="data[field]" />
              </template>
            </Column>
            <Column field="value" header="Callback" style=" min-width: 20rem">
              <template #editor="{ data, field }">
                <Textarea class="w-100%" v-model="data[field]" rows="5" cols="30" placeholder="请输入Callback"></Textarea>
              </template>
            </Column>
            <Column field="tips" header="Tips" style="min-width: 20rem">
              <template #editor="{ data, field }">
                <Chips class="w-100% block" v-model="data[field]" placeholder="请输入Tips" />
              </template>
            </Column>
            <Column :rowEditor="true"  header="Edit" style="width: 10%; min-width: 8rem">
            </Column>
            <Column  header="Delete">
              <template #body="{ data, field,index }">
                <Button class="w-24 h-24 padding-0" icon="pi pi-times" size="small" severity="danger" text raised rounded @click="deleteRow($event,index,'rule')"/>
              </template>
            </Column>
        </DataTable>
      </AccordionTab>
      <AccordionTab>
        <template #header>
            <span class="flex gap-2 align-center justify-between w-100%">
                <span class="font-bold white-space-nowrap">Theme(主题色)</span>
                <Button class="w-24 h-24 padding-0 relative" icon="pi pi-plus-circle" size="small" severity="success" text raised rounded @click.capture.stop="toggleAdd('theme')"/>
            </span>
        </template>
        <DataTable v-model:editingRows="themeEditRows"  :value="themeStore.theme" editMode="row" @row-edit-save="rowEditSave($event,'theme')">
            <Column field="name" header="Key">
              <template #editor="{ data, field }">
                  <InputText type="text" v-model="data[field]" />
              </template>
            </Column>
            <Column field="value" header="Color">
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
      <AccordionTab>
        <template #header>
            <span class="flex gap-2 align-center justify-between w-100%">
                <span class="font-bold white-space-nowrap">PseudoClass(伪类)</span>
                <Button class="w-24 h-24 padding-0 relative" icon="pi pi-plus-circle" size="small" severity="success" text raised rounded @click.capture.stop="toggleAdd('pseudoClass')"/>
            </span>
        </template>
        <DataTable v-model:editingRows="pseudoClassEditRows"  :value="pseudoClassStore.pseudoClass" editMode="row" @row-edit-save="rowEditSave($event,'pseudoClass')">
            <Column field="name" header="Key">
              <template #editor="{ data, field }">
                  <InputText type="text" v-model="data[field]" />
              </template>
            </Column>
            <Column field="value" header="PseudoClass">
              <template #editor="{ data, field }">
                  <InputText type="text" v-model="data[field]" />
              </template>
            </Column>
            <Column :rowEditor="true"  header="Edit" style="width: 10%; min-width: 8rem">
            </Column>
            <Column  header="Delete">
              <template #body="{ data, field,index }">
                <Button class="w-24 h-24 padding-0" icon="pi pi-times" size="small" severity="danger" text raised rounded @click="deleteRow($event,index,'pseudoClass')"/>
              </template>
            </Column>
        </DataTable>
      </AccordionTab>
      <AccordionTab>
        <template #header>
            <span class="flex gap-2 align-center justify-between w-100%">
                <span class="font-bold white-space-nowrap">Responsive(响应式)</span>
                <Button class="w-24 h-24 padding-0 relative" icon="pi pi-plus-circle" size="small" severity="success" text raised rounded @click.capture.stop="toggleAdd('responsive')"/>
            </span>
        </template>
        <DataTable v-model:editingRows="responsiveEditRows"  :value="responsiveStore.responsive" editMode="row" @row-edit-save="rowEditSave($event,'responsive')">
            <Column field="name" header="Key">
              <template #editor="{ data, field }">
                  <InputText type="text" v-model="data[field]" />
              </template>
            </Column>
            <Column field="value" header="Responsive">
              <template #editor="{ data, field }">
                  <InputText type="text" v-model="data[field]" />
              </template>
            </Column>
            <Column :rowEditor="true"  header="Edit" style="width: 10%; min-width: 8rem">
            </Column>
            <Column  header="Delete">
              <template #body="{ data, field,index }">
                <Button class="w-24 h-24 padding-0" icon="pi pi-times" size="small" severity="danger" text raised rounded @click="deleteRow($event,index,'pseudoClass')"/>
              </template>
            </Column>
        </DataTable>
      </AccordionTab>
    </Accordion>
  </Dialog>
  <ConfirmPopup></ConfirmPopup> 
  <Dialog v-model:visible="addVisible" :header="addHeader" modal :style="{ width: '30rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div v-if="addForm.type != 'rule'" class="w-100% h-auto overflow-h flex-c gap-8 padding-tb-8 align-end">
      <InputText class="w-100%" type="text" v-model="addForm.key" placeholder="请输入Key"/>
      <InputText class="w-100%" type="text" v-model="addForm.value" :placeholder="`请输入${addForm.type == 'theme'?'Color':addForm.type == 'pseudoClass'?'PseudoClass':'@media'}`"/>
      <Button class="flex justify-center float-right margin-r-4" @click="saveForm">确定</Button>
    </div>
    <div v-else class="w-100% h-auto overflow-h flex-c gap-8 padding-tb-8 align-end">
      <InputText class="w-100%" type="text" v-model="addForm.key" placeholder="请输入Regexp"/>
      <Textarea class="w-100%" v-model="addForm.value" rows="5" cols="30" placeholder="请输入Callback"></Textarea>
      <Chips class="w-100% block" v-model="addForm.tips" placeholder="请输入Tips" />
      <Button class="flex justify-center float-right margin-r-4" @click="saveForm">确定</Button>
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
  import Textarea from 'primevue/textarea';
  import Button from 'primevue/button';
  import ConfirmPopup from 'primevue/confirmpopup';
  import Chips from 'primevue/chips';
  
  import {ref} from 'vue';
  import {useThemeStore,usePseudoClassStore,useResponsiveStore,useRulesStore} from '../store/SettingStore'
  const themeStore = useThemeStore();
  const rulesStore = useRulesStore();
  const pseudoClassStore = usePseudoClassStore();
  const responsiveStore = useResponsiveStore();
  const visible = ref(false);
  const addVisible = ref(false);
  const addHeader = ref('新增')
  const addForm = ref({
    key:'',
    value:'',
    type:'',
    tips:[]
  })
  function toggle(){
    visible.value = !visible.value;
  }
  function toggleAdd(type){
    addVisible.value = true
    addForm.value.type = type
    addHeader.value = `新增${type.charAt(0).toUpperCase() + type.slice(1)}`
  }
  
  
  const rulesEditRows = ref([])
  const themeEditRows = ref([])
  const pseudoClassEditRows = ref([])
  const responsiveEditRows = ref([])
  function saveForm(){
    if(addForm.value.type == 'theme'){
      themeStore.addTheme(addForm.value.key,addForm.value.value);
    }else if(addForm.value.type == 'pseudoClass'){
      pseudoClassStore.addPseudoClass(addForm.value.key,addForm.value.value);
    }else if(addForm.value.type == 'responsive'){
      responsiveStore.addResponsive(addForm.value.key,addForm.value.value)
    }else if(addForm.value.type == 'rule'){
      rulesStore.addRules(addForm.value.key,addForm.value.value,addForm.value.tips)
    }
    addVisible.value = false
    addForm.value.key = ''
    addForm.value.value = ''
    addForm.value.type = ''
    addForm.value.tips = []
  }
  function rowEditSave(event,type){
    let { newData, index } = event;
    if(type == 'theme'){
      themeStore.changeTheme(index,newData)
    }else if(type == 'pseudoClass'){
      pseudoClassStore.changePseudoClass(index,newData)
    }else if(type == 'responsive'){
      responsiveStore.changePseudoClass(index,newData)
    }else if(type == 'rule'){
      rulesStore.changeRules(index,newData)
    }
  }
  import { useConfirm } from "primevue/useconfirm";
  const confirm = useConfirm()
  function deleteRow(event,index,type){
    confirm.require({
        target: event.currentTarget,
        message: '你确定删除当前配置么',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          switch(type){
            case 'theme':
              themeStore.deleteTheme(index)
              break;
            case 'pseudoClass':
              pseudoClassStore.deletePseudoClass(index)
              break;
            case 'responsive':
              responsiveStore.deleteResponsive(index)
              break;
            case 'rule':
              rulesStore.deleteRules(index)
              break;
            default:
              break;
          }
        },
        reject: () => {
            
        }
    });
  };

  function showTipInfo(type){
    
  }
  

  defineExpose({toggle})
</script>