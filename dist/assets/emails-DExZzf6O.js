import{r as p,j as e,B as h,T as m,$ as u,v as j,E as $,t as k,D as I,H as T}from"./index-DNJ-7_Rf.js";import{C as D}from"./config-global-CwnLHF89.js";import{u as F}from"./useQuery-Cikl35b1.js";import{f as A}from"./users-Dd3MPzKO.js";import{C as N}from"./Card-98N49c-B.js";import{S as O}from"./Stack-BvggcJT0.js";import{F as y,O as z}from"./Select-C6NYPjTS.js";import{A as W}from"./Autocomplete-BwuapI8N.js";import{T as w}from"./TextField-DrqQKz-z.js";import{C as P}from"./Chip-BXj8O4Gd.js";import{I as U}from"./InputAdornment-CuTnuXim.js";import{S as q}from"./Snackbar-Ca286brL.js";import"./useControlled-CYejl48w.js";import"./Popper-yRRR-Rwr.js";const B=(t,s)=>{const a="https://srid7vtf90.ufs.sh/f/B7pTWizqIefF6Wmfc0v0s5x8Q4aVFIGMnWpY6SvKzygLCrhD",o="#53752C";return`
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${s}</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
        color: #444444;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      }
      .header {
        padding: 30px 20px;
        background-color: #ffffff;
        text-align: left;
        border-bottom: 1px solid #eeeeee;
      }
      .logo {
        max-width: 180px;
        height: auto;
        margin-bottom: 10px;
      }
      .subject {
        color: ${o};
        margin: 20px 0 5px;
        font-size: 24px;
        font-weight: 600;
        line-height: 1.3;
      }
      .content {
        padding: 35px 40px;
        background-color: #ffffff;
        color: #555555;
        font-size: 16px;
      }
      .message {
        white-space: pre-line;
      }
      .footer {
        padding: 25px 20px;
        text-align: center;
        background-color: #f9f9f9;
        border-top: 1px solid #eeeeee;
      }
      .company-name {
        color: ${o};
        font-weight: 700;
        font-size: 16px;
        margin: 0;
        letter-spacing: 1px;
      }
      .copyright {
        margin: 8px 0;
        font-size: 13px;
        color: #888888;
      }
      @media only screen and (max-width: 620px) {
        .container {
          width: 100% !important;
          margin: 0 !important;
          border-radius: 0 !important;
        }
        .content {
          padding: 30px 25px !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="${a}" alt="Artifields Logo" class="logo">
        <h2 class="subject">${s}</h2>
      </div>
      <div class="content">
        <div class="message">${t.replace(/\n/g,"<br>")}</div>
      </div>
      <div class="footer">
        <p class="company-name">ARTIFIELDS</p>
        <p class="copyright">© ${new Date().getFullYear()} Todos los derechos reservados</p>
      </div>
    </div>
  </body>
  </html>
  `},L=async(t,s,a)=>{try{const o=B(a,s),l={to:t,subject:s,text:a,html:o},i=await fetch(`${k}/api/email/send`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)});if(!i.ok){const n=await i.json();throw new Error(n.message||`Error al enviar correo a ${t}`)}return await i.json()}catch(o){throw console.error(`Error al enviar correo a ${t}:`,o),o}},H=async(t,s,a)=>{const o=t.map(d=>L(d.correo,s,a)),l=await Promise.allSettled(o),i=l.filter(d=>d.status==="fulfilled").length,n=l.filter(d=>d.status==="rejected").length;if(n>0)throw new Error(`Se enviaron ${i} correos correctamente, pero fallaron ${n} envíos.`);return{success:!0,message:`${i} correos enviados correctamente.`}},R=()=>{const[t,s]=p.useState([]),[a,o]=p.useState(""),[l,i]=p.useState(""),[n,d]=p.useState(!1),[f,g]=p.useState({open:!1,message:"",severity:"success"}),{data:E}=F({queryKey:["all-users"],queryFn:A}),b=()=>{g(r=>({...r,open:!1}))},x=(r,c)=>{g({open:!0,message:r,severity:c})},C=async()=>{if(!t.length||!a||!l){x("Por favor complete todos los campos","error");return}try{d(!0);const r=await H(t,a,l);s([]),o(""),i(""),x(r.message,"success")}catch(r){console.error("Error:",r),x(r.message||"Error al enviar los correos","error")}finally{d(!1)}};return e.jsxs(h,{sx:{mt:3},children:[e.jsx(N,{sx:{p:{xs:2,md:4}},children:e.jsxs(O,{spacing:3,children:[e.jsx(y,{fullWidth:!0,children:e.jsx(W,{multiple:!0,options:E||[],getOptionLabel:r=>r.nombre,value:t,onChange:(r,c)=>s(c),renderInput:r=>e.jsx(w,{...r,placeholder:"Seleccionar destinatarios"}),renderOption:(r,c)=>p.createElement("li",{...r,key:c.id},e.jsxs(h,{children:[e.jsx(m,{variant:"body1",children:c.nombre}),e.jsx(m,{variant:"caption",color:"text.secondary",children:c.correo})]})),renderTags:(r,c)=>r.map((v,S)=>e.jsx(P,{...c({index:S}),label:e.jsxs(h,{sx:{display:"flex",flexDirection:"column"},children:[e.jsx(m,{variant:"caption",sx:{fontWeight:"bold"},children:v.nombre}),e.jsx(m,{variant:"caption",color:"text.secondary",children:v.correo})]}),sx:{m:.5,height:"auto",py:1}})),componentsProps:{paper:{sx:{boxShadow:3,borderRadius:1,mt:.5,border:"1px solid rgb(240,240,240)"}}},disabled:n})}),e.jsx(y,{fullWidth:!0,children:e.jsx(z,{value:a,onChange:r=>o(r.target.value),placeholder:"Ingrese el asunto",startAdornment:e.jsx(U,{position:"start",children:e.jsx(u,{icon:"solar:bookmark-square-minimalistic-bold-duotone",width:20,color:"#666"})}),sx:{bgcolor:"rgba(0, 0, 0, 0.03)"},disabled:n})}),e.jsx(w,{fullWidth:!0,multiline:!0,rows:8,value:l,onChange:r=>i(r.target.value),placeholder:"Escriba su mensaje aquí...",sx:{bgcolor:"rgba(0, 0, 0, 0.03)"},disabled:n}),e.jsxs(h,{sx:{display:"flex",justifyContent:"flex-end",gap:2,mt:2},children:[e.jsx(j,{variant:"contained",color:"error",startIcon:e.jsx(u,{icon:"solar:trash-bin-trash-bold"}),onClick:()=>{s([]),o(""),i("")},disabled:n,children:"Descartar"}),e.jsx(j,{variant:"contained",color:"primary",startIcon:e.jsx(u,{icon:"solar:send-bold"}),onClick:C,disabled:n||!a||!l||t.length===0,children:n?"Enviando...":"Enviar"})]})]})}),e.jsx(q,{open:f.open,autoHideDuration:6e3,onClose:b,anchorOrigin:{vertical:"top",horizontal:"right"},children:e.jsx($,{onClose:b,severity:f.severity,sx:{width:"100%"},children:f.message})})]})};function K(){return e.jsxs(I,{children:[e.jsx(m,{variant:"h4",children:"Nuevo correo"}),e.jsx(R,{})]})}function ae(){return e.jsxs(e.Fragment,{children:[e.jsx(T,{children:e.jsxs("title",{children:[" ",`Emails - ${D.appName}`]})}),e.jsx(K,{})]})}export{ae as default};
