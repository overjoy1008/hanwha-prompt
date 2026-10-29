'use strict';
const fields=['topic','company','role','name','context'];
const $=id=>document.getElementById(id);
let template='';
function values(){return Object.fromEntries(fields.map(id=>[id,$(id).value.trim()||({topic:'여기에 PT 주제를 입력',company:'한화생명',role:'AI·데이터',name:'이름',context:'제공 자료 없음 — 확인되지 않은 경험을 만들지 말 것'}[id])]));}
function render(){if(!template)return;const v=values();$('preview').value=template.replace(/\{\{(topic|company|role|name|context)\}\}/g,(_,key)=>v[key]);$('filename').textContent=`${v.role}_${v.name}.pdf`;$('char-count').textContent=`${$('preview').value.length.toLocaleString('ko-KR')}자`;$('status').textContent='';}
function download(ext){if(!template)return;const blob=new Blob(['\ufeff'+$('preview').value],{type:ext==='md'?'text/markdown;charset=utf-8':'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`hanwha-prompt.${ext}`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);$('status').textContent=`${ext.toUpperCase()} 파일을 다운로드했습니다.`;}
fields.forEach(id=>$(id).addEventListener('input',render));
$('prompt-form').addEventListener('submit',e=>e.preventDefault());
$('copy').addEventListener('click',async()=>{if(!template)return;try{await navigator.clipboard.writeText($('preview').value);$('status').textContent='복사했습니다. ChatGPT에 붙여넣으세요.';}catch{$('preview').focus();$('preview').select();$('status').textContent='프롬프트를 선택했습니다. Ctrl+C 또는 ⌘C로 복사하세요.';}});
$('download').addEventListener('click',()=>download('txt'));
$('markdown').addEventListener('click',()=>download('md'));
fetch('prompt.txt').then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text();}).then(text=>{template=text;render();}).catch(()=>{$('status').textContent='불러오지 못했습니다. 새로고침하거나 아래 원본 템플릿을 다운로드하세요.';$('char-count').textContent='불러오기 실패';for(const id of ['copy','download','markdown'])$(id).disabled=true;});
