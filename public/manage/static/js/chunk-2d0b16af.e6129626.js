(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0b16af"],{2083:function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"crumbs"},[a("el-breadcrumb",{attrs:{separator:"/"}},[a("el-breadcrumb-item",[a("i",{staticClass:"el-icon-s-custom"}),t._v(" 管理员管理")]),a("el-breadcrumb-item",[t._v("新增管理员")])],1)],1),a("div",{staticClass:"container"},[a("div",{staticClass:"form-box"},[a("el-form",{ref:"form",attrs:{model:t.form,"label-width":"80px"}},[a("el-form-item",{attrs:{label:"登录名"}},[a("el-input",{model:{value:t.form.uid,callback:function(e){t.$set(t.form,"uid",e)},expression:"form.uid"}})],1),a("el-form-item",{attrs:{label:"密码"}},[a("el-input",{attrs:{type:"password"},model:{value:t.form.pwd,callback:function(e){t.$set(t.form,"pwd",e)},expression:"form.pwd"}})],1),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:t.onSubmit}},[t._v("表单提交")]),a("el-button",[t._v("取消")])],1)],1)],1)])])},s=[],o={name:"addAdmin",data:function(){return{form:{uid:"",pwd:""}}},methods:{onSubmit:function(){var t=this;this.$axios.post("http://127.0.0.1/api/addAdmin",t.form).then(function(e){e.data.flag?(t.$message.success("添加成功！"),t.form={uid:"",pwd:""}):t.$message.error(e.data.msg)},function(e){t.$message.error(e)})}}},i=o,n=a("2877"),l=Object(n["a"])(i,r,s,!1,null,null,null);e["default"]=l.exports}}]);