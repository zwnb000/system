(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-f10480d6"],{"0290":function(e,r,t){"use strict";t.r(r);var s=function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("div",{staticClass:"login-wrap"},[t("div",{staticClass:"ms-login"},[t("div",{staticClass:"ms-title"},[e._v("后台管理系统")]),t("el-form",{ref:"ruleForm",staticClass:"ms-content",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"0px"}},[t("el-form-item",{attrs:{prop:"username"}},[t("el-input",{attrs:{placeholder:"用户名"},model:{value:e.ruleForm.username,callback:function(r){e.$set(e.ruleForm,"username",r)},expression:"ruleForm.username"}},[t("el-button",{attrs:{slot:"prepend",icon:"el-icon-lx-people"},slot:"prepend"})],1)],1),t("el-form-item",{attrs:{prop:"password"}},[t("el-input",{attrs:{type:"password",placeholder:"密码"},nativeOn:{keyup:function(r){return!r.type.indexOf("key")&&e._k(r.keyCode,"enter",13,r.key,"Enter")?null:e.submitForm("ruleForm")}},model:{value:e.ruleForm.password,callback:function(r){e.$set(e.ruleForm,"password",r)},expression:"ruleForm.password"}},[t("el-button",{attrs:{slot:"prepend",icon:"el-icon-lx-lock"},slot:"prepend"})],1)],1),t("div",{staticClass:"login-btn"},[t("el-button",{attrs:{type:"primary"},on:{click:function(r){return e.submitForm("ruleForm")}}},[e._v("登录")])],1),t("p",{staticClass:"login-tips"},[e._v("Tips : 用户名和密码随便填。")])],1)],1)])},a=[],o={data:function(){return{ruleForm:{username:"",password:"",captcha:""},rules:{username:[{required:!0,message:"请输入用户名",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"}]}}},methods:{submitForm:function(e){var r=this,t={username:r.ruleForm.username,password:r.ruleForm.password,captcha:r.ruleForm.captcha};console.log(t),this.$axios.post("/api/login",t).then(function(e){e.data.flag?(r.login=e.data.flag,localStorage.setItem("ms_username",r.ruleForm.username),r.$router.push("/")):alert(e.data.msg)})}}},l=o,n=(t("e288"),t("2877")),u=Object(n["a"])(l,s,a,!1,null,"1caee17f",null);r["default"]=u.exports},aca1:function(e,r,t){},e288:function(e,r,t){"use strict";var s=t("aca1"),a=t.n(s);a.a}}]);