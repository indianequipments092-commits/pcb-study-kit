(function(){
'use strict';

const SUPABASE_URL='https://xmubirikizzdsikkfnej.supabase.co';
const SUPABASE_KEY='sb_publishable_K8jIPdbFDB8nWkwSABqv9g_qM5_cS4d';

function boot(){
  if(document.getElementById('pcb-stage2-auth')) return;

  const css=document.createElement('style');
  css.id='pcb-stage2-auth-css';
  css.textContent=`
#pcb-stage2-auth{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:18px;background:radial-gradient(circle at 15% 10%,rgba(124,92,255,.22),transparent 32%),radial-gradient(circle at 85% 10%,rgba(34,211,238,.16),transparent 30%),rgba(3,7,18,.94);backdrop-filter:blur(24px);overflow:auto}
#pcb-stage2-auth.show{display:flex}
.pcb-auth-box{width:min(560px,100%);border:1px solid rgba(148,163,184,.18);border-radius:30px;padding:25px;background:rgba(12,18,34,.94);box-shadow:0 35px 100px rgba(0,0,0,.55);color:#f8fafc}
.pcb-auth-brand{display:flex;align-items:center;gap:12px;margin-bottom:18px}.pcb-auth-logo{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;background:linear-gradient(135deg,#7c5cff,#22d3ee);font-weight:900;font-size:20px}.pcb-auth-title{font-size:23px;font-weight:900;letter-spacing:-.7px}.pcb-auth-sub{font-size:11px;color:#94a3b8;margin-top:2px}
.pcb-auth-tabs{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:15px 0}.pcb-auth-tab{padding:11px;border-radius:13px;border:1px solid rgba(148,163,184,.16);background:rgba(148,163,184,.07);color:#e2e8f0;font-weight:800;cursor:pointer}.pcb-auth-tab.active{background:linear-gradient(135deg,#7c5cff,#5b8cff);border-color:transparent;color:white}
.pcb-auth-panel{display:none}.pcb-auth-panel.active{display:block}.pcb-auth-label{display:block;margin:10px 0 6px;font-size:11px;color:#cbd5e1;font-weight:800}.pcb-auth-input{width:100%;box-sizing:border-box;padding:13px 14px;border-radius:14px;border:1px solid rgba(148,163,184,.18);background:rgba(2,6,23,.58);color:#f8fafc;outline:none}.pcb-auth-input:focus{border-color:#7c5cff;box-shadow:0 0 0 4px rgba(124,92,255,.12)}
.pcb-auth-btn{width:100%;margin-top:14px;padding:13px 15px;border:0;border-radius:14px;background:linear-gradient(135deg,#7c5cff,#5b8cff);color:white;font-weight:900;cursor:pointer}.pcb-auth-btn:disabled{opacity:.6;cursor:wait}.pcb-auth-secondary{width:100%;margin-top:8px;padding:11px;border:1px solid rgba(148,163,184,.18);border-radius:14px;background:rgba(148,163,184,.07);color:#e2e8f0;font-weight:800;cursor:pointer}.pcb-auth-msg{display:none;margin-top:11px;padding:11px 13px;border-radius:13px;font-size:11px}.pcb-auth-msg.show{display:block}.pcb-auth-msg.error{background:rgba(251,113,133,.1);border:1px solid rgba(251,113,133,.2);color:#fecdd3}.pcb-auth-msg.ok{background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.2);color:#bbf7d0}.pcb-auth-note{font-size:10px;color:#94a3b8;margin-top:10px;line-height:1.5}.pcb-auth-row{display:grid;grid-template-columns:1fr 1fr;gap:9px}.pcb-auth-link{display:inline-block;margin-top:10px;color:#a5b4fc;font-size:11px;font-weight:800;cursor:pointer}.pcb-auth-account{position:fixed;right:15px;top:74px;z-index:9998;display:none;align-items:center;gap:8px;padding:8px 10px;border-radius:999px;background:rgba(10,15,30,.9);border:1px solid rgba(148,163,184,.18);color:#e2e8f0;font-size:10px;backdrop-filter:blur(15px)}.pcb-auth-account.show{display:flex}.pcb-auth-logout{border:0;border-radius:999px;padding:5px 8px;background:rgba(251,113,133,.12);color:#fecdd3;font-size:10px;font-weight:800;cursor:pointer}
@media(max-width:560px){.pcb-auth-box{padding:20px;border-radius:24px}.pcb-auth-row{grid-template-columns:1fr}.pcb-auth-account{top:auto;bottom:78px;right:12px}}
`;
  document.head.appendChild(css);

  const gate=document.createElement('div');
  gate.id='pcb-stage2-auth';
  gate.innerHTML=`
    <div class="pcb-auth-box">
      <div class="pcb-auth-brand"><div class="pcb-auth-logo">P</div><div><div class="pcb-auth-title">PCB Study Kit</div><div class="pcb-auth-sub">Secure Student & Admin Access</div></div></div>
      <div class="pcb-auth-tabs"><button class="pcb-auth-tab active" data-auth-tab="student">Student</button><button class="pcb-auth-tab" data-auth-tab="admin">Admin</button></div>
      <div id="pcb-auth-error" class="pcb-auth-msg error"></div><div id="pcb-auth-ok" class="pcb-auth-msg ok"></div>
      <section class="pcb-auth-panel active" id="pcb-auth-student">
        <form id="pcb-login-form">
          <label class="pcb-auth-label">Email</label><input class="pcb-auth-input" id="pcb-login-email" type="email" required autocomplete="email" placeholder="student@example.com">
          <label class="pcb-auth-label">Password</label><input class="pcb-auth-input" id="pcb-login-password" type="password" required autocomplete="current-password" placeholder="••••••••">
          <button class="pcb-auth-btn" type="submit">Sign In</button>
        </form>
        <button class="pcb-auth-secondary" id="pcb-show-signup">Create Student Account</button>
        <span class="pcb-auth-link" id="pcb-show-forgot">Forgot password?</span>
      </section>
      <section class="pcb-auth-panel" id="pcb-auth-signup">
        <form id="pcb-signup-form">
          <label class="pcb-auth-label">Full Name</label><input class="pcb-auth-input" id="pcb-signup-name" required autocomplete="name" placeholder="Your full name">
          <div class="pcb-auth-row"><div><label class="pcb-auth-label">Email</label><input class="pcb-auth-input" id="pcb-signup-email" type="email" required autocomplete="email" placeholder="student@example.com"></div><div><label class="pcb-auth-label">Mobile (optional)</label><input class="pcb-auth-input" id="pcb-signup-mobile" inputmode="tel" placeholder="Mobile number"></div></div>
          <div class="pcb-auth-row"><div><label class="pcb-auth-label">Password</label><input class="pcb-auth-input" id="pcb-signup-password" type="password" minlength="8" required autocomplete="new-password" placeholder="Minimum 8 characters"></div><div><label class="pcb-auth-label">Confirm Password</label><input class="pcb-auth-input" id="pcb-signup-password2" type="password" minlength="8" required autocomplete="new-password" placeholder="Repeat password"></div></div>
          <button class="pcb-auth-btn" type="submit">Create Student Account</button>
        </form>
        <span class="pcb-auth-link" id="pcb-back-login">← Back to Sign In</span>
      </section>
      <section class="pcb-auth-panel" id="pcb-auth-forgot">
        <form id="pcb-forgot-form"><label class="pcb-auth-label">Account Email</label><input class="pcb-auth-input" id="pcb-forgot-email" type="email" required placeholder="student@example.com"><button class="pcb-auth-btn" type="submit">Send Reset Email</button></form>
        <span class="pcb-auth-link" id="pcb-forgot-back">← Back to Sign In</span>
      </section>
      <section class="pcb-auth-panel" id="pcb-auth-admin">
        <form id="pcb-admin-form"><label class="pcb-auth-label">Admin Email</label><input class="pcb-auth-input" id="pcb-admin-email" type="email" required autocomplete="email" placeholder="admin@example.com"><label class="pcb-auth-label">Password</label><input class="pcb-auth-input" id="pcb-admin-password" type="password" required autocomplete="current-password" placeholder="••••••••"><button class="pcb-auth-btn" type="submit">Admin Sign In</button></form>
        <div class="pcb-auth-note">Main Admin and Sub Admin accounts are created/managed securely by the backend. There is no public admin signup.</div>
      </section>
      <div class="pcb-auth-note">Your account data is stored securely in Supabase. Student IDs are generated automatically after registration.</div>
    </div>`;
  document.body.appendChild(gate);

  const account=document.createElement('div');
  account.id='pcb-stage2-account';
  account.className='pcb-auth-account';
  account.innerHTML='<span id="pcb-account-text"></span><button class="pcb-auth-logout" id="pcb-account-logout">Logout</button>';
  document.body.appendChild(account);

  let client;
  const showMsg=(text,ok=false)=>{const e=document.getElementById(ok?'pcb-auth-ok':'pcb-auth-error');const x=document.getElementById(ok?'pcb-auth-error':'pcb-auth-ok');x.classList.remove('show');e.textContent=text;e.classList.add('show');};
  const clearMsg=()=>{document.getElementById('pcb-auth-error').classList.remove('show');document.getElementById('pcb-auth-ok').classList.remove('show');};
  const setPanel=(name)=>{document.querySelectorAll('.pcb-auth-panel').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.pcb-auth-tab').forEach(x=>x.classList.remove('active'));const p=document.getElementById('pcb-auth-'+name);if(p)p.classList.add('active');const t=document.querySelector('[data-auth-tab="'+(name==='student'||name==='signup'||name==='forgot'?'student':'admin')+'"]');if(t)t.classList.add('active');clearMsg();};

  document.querySelectorAll('[data-auth-tab]').forEach(b=>b.addEventListener('click',()=>setPanel(b.dataset.authTab)));
  document.getElementById('pcb-show-signup').onclick=()=>setPanel('signup');
  document.getElementById('pcb-show-forgot').onclick=()=>setPanel('forgot');
  document.getElementById('pcb-back-login').onclick=()=>setPanel('student');
  document.getElementById('pcb-forgot-back').onclick=()=>setPanel('student');

  const start=async()=>{
    if(!window.supabase){
      const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      s.onload=()=>init();s.onerror=()=>showMsg('Supabase library load failed. Please try again.');document.head.appendChild(s);
    }else init();
  };
  const init=async()=>{
    try{
      client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
      const {data:{session}}=await client.auth.getSession();
      if(session) await enter(session); else gate.classList.add('show');
      client.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_IN'&&session) enter(session);if(event==='SIGNED_OUT'){account.classList.remove('show');gate.classList.add('show');}});
    }catch(e){gate.classList.add('show');showMsg(e.message||'Authentication could not start.');}
  };
  const enter=async(session)=>{
    clearMsg();
    const {data:profile,error}=await client.from('profiles').select('full_name,email,role,status,student_id,sub_admin_id').eq('id',session.user.id).single();
    if(error||!profile){await client.auth.signOut();showMsg('Account profile is not ready yet. Please complete registration/verification and try again.');return;}
    if(profile.status!=='active'){await client.auth.signOut();showMsg('This account is currently '+profile.status+'. Please contact the administrator.');return;}
    const id=profile.role==='student'?profile.student_id:(profile.role==='sub_admin'?profile.sub_admin_id:'MAIN');
    document.getElementById('pcb-account-text').textContent=(profile.full_name||session.user.email)+' · '+profile.role.replace('_',' ').toUpperCase()+' · '+id;
    account.classList.add('show');gate.classList.remove('show');
  };

  document.getElementById('pcb-login-form').onsubmit=async(e)=>{e.preventDefault();clearMsg();const btn=e.submitter;btn.disabled=true;const {error}=await client.auth.signInWithPassword({email:document.getElementById('pcb-login-email').value.trim().toLowerCase(),password:document.getElementById('pcb-login-password').value});btn.disabled=false;if(error)showMsg(error.message);};
  document.getElementById('pcb-signup-form').onsubmit=async(e)=>{e.preventDefault();clearMsg();const name=document.getElementById('pcb-signup-name').value.trim();const email=document.getElementById('pcb-signup-email').value.trim().toLowerCase();const mobile=document.getElementById('pcb-signup-mobile').value.trim();const pass=document.getElementById('pcb-signup-password').value;const pass2=document.getElementById('pcb-signup-password2').value;if(pass!==pass2){showMsg('Passwords do not match.');return;}const btn=e.submitter;btn.disabled=true;const {data,error}=await client.auth.signUp({email,password:pass,options:{data:{full_name:name,mobile}}});btn.disabled=false;if(error){showMsg(error.message);return;}if(data.session){await enter(data.session);}else{showMsg('Account created. Please verify your email, then sign in.',true);setPanel('student');}};
  document.getElementById('pcb-forgot-form').onsubmit=async(e)=>{e.preventDefault();clearMsg();const email=document.getElementById('pcb-forgot-email').value.trim().toLowerCase();const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:location.href});if(error)showMsg(error.message);else showMsg('Password reset email sent. Check your inbox.',true);};
  document.getElementById('pcb-admin-form').onsubmit=async(e)=>{e.preventDefault();clearMsg();const btn=e.submitter;btn.disabled=true;const {data,error}=await client.auth.signInWithPassword({email:document.getElementById('pcb-admin-email').value.trim().toLowerCase(),password:document.getElementById('pcb-admin-password').value});btn.disabled=false;if(error){showMsg(error.message);return;}const {data:p,error:pe}=await client.from('profiles').select('role,status').eq('id',data.user.id).single();if(pe||!p||!['main_admin','sub_admin'].includes(p.role)){await client.auth.signOut();showMsg('This account is not an administrator.');return;}if(p.status!=='active'){await client.auth.signOut();showMsg('Administrator account is not active.');}};
  document.getElementById('pcb-account-logout').onclick=()=>client.auth.signOut();
  start();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
