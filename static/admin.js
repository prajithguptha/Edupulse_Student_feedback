const $=s=>document.querySelector(s);let allCourses=[],allFeedback=[];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function options(){
 $('#c-branch').innerHTML=window.ADMIN_BRANCHES.map(x=>`<option>${esc(x)}</option>`).join('');
 $('#branch-filter').innerHTML='<option value="">All branches</option>'+window.ADMIN_BRANCHES.map(x=>`<option>${esc(x)}</option>`).join('');
 $('#c-semester').innerHTML=window.ADMIN_SEMESTERS.map(x=>`<option value="${x}">Semester ${x}</option>`).join('');
 $('#semester-filter').innerHTML='<option value="">All semesters</option>'+window.ADMIN_SEMESTERS.map(x=>`<option value="${x}">Semester ${x}</option>`).join('');
}
async function load(){
 const r=await fetch('/admin/api/data');if(r.status===401){location.href='/admin/login';return}
 const d=await r.json();if(!r.ok){alert(d.error);return}
 allCourses=d.courses;allFeedback=d.feedback;
 $('#admin-total').textContent=d.summary.total_responses;$('#admin-courses').textContent=allCourses.length;$('#admin-average').textContent=d.summary.overall_average.toFixed(2);
 $('#catalog-table').innerHTML=allCourses.map(c=>`<tr><td>${esc(c.code)}</td><td>${esc(c.branch)}</td><td>${c.semester}</td><td>${esc(c.name)}</td><td>${esc(c.lecturer_name)}</td><td>${esc(c.profession)}</td><td><button class="edit-btn" data-code="${esc(c.code)}">Edit</button></td></tr>`).join('');
 renderFeedback();
}
function renderFeedback(){
 const q=$('#feedback-search').value.toLowerCase(),b=$('#branch-filter').value,s=$('#semester-filter').value;
 const rows=allFeedback.filter(x=>(!b||x.branch===b)&&(!s||String(x.semester)===s)&&[x.student_name,x.student_id,x.course_name,x.lecturer_name,x.course_code].join(' ').toLowerCase().includes(q));
 $('#feedback-table').innerHTML=rows.map(x=>{const avg=x.ratings.reduce((a,v)=>a+Number(v),0)/Math.max(x.ratings.length,1);return `<tr><td>${esc(x.student_name)}</td><td>${esc(x.student_id)}</td><td>${esc(x.branch)} / ${x.semester}</td><td>${esc(x.course_name)}</td><td>${esc(x.lecturer_name)}</td>${x.ratings.map(v=>`<td><b>${v}/5</b></td>`).join('')}<td>${avg.toFixed(2)}</td><td>${esc((x.submitted_at||'').slice(0,10))}</td></tr>`}).join('')||'<tr><td colspan="12">No feedback records match your filters.</td></tr>';
}
function clearForm(){ $('#course-form').reset();$('#c-code').disabled=false;$('#c-code').value='';$('#c-lecturer').value='';$('#c-profession').value='Faculty'; }
$('#course-form').addEventListener('submit',async e=>{
 e.preventDefault();const p={code:$('#c-code').value.trim(),branch:$('#c-branch').value,semester:Number($('#c-semester').value),name:$('#c-name').value.trim(),lecturer_name:$('#c-lecturer').value.trim(),profession:$('#c-profession').value.trim()};
 const r=await fetch('/admin/api/course',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)}),d=await r.json();
 $('#admin-message').textContent=d.message||d.error;$('#admin-message').className='form-message '+(r.ok?'success':'error');if(r.ok){clearForm();load();}
});
$('#catalog-table').addEventListener('click',e=>{const btn=e.target.closest('[data-code]');if(!btn)return;const c=allCourses.find(x=>x.code===btn.dataset.code);$('#c-code').value=c.code;$('#c-code').disabled=true;$('#c-branch').value=c.branch;$('#c-semester').value=c.semester;$('#c-name').value=c.name;$('#c-lecturer').value=c.lecturer_name;$('#c-profession').value=c.profession;window.scrollTo({top:0,behavior:'smooth'});});
$('#clear-form').addEventListener('click',clearForm);
['#feedback-search','#branch-filter','#semester-filter'].forEach(s=>$(s).addEventListener('input',renderFeedback));
options();load();
