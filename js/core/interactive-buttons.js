/* ---------- INTERACTIVE HIGHLIGHTED BUTTONS ---------- */
function enhanceInteractiveButtons(root){
  if(!root)return;
  root.querySelectorAll('.btn-primary,.btn-grad').forEach(button=>{
    if(button.classList.contains('btn-interactive'))return;
    const labelText=button.textContent.replace(/\s+/g,' ').trim();
    if(!labelText)return;

    const label=document.createElement('span');
    label.className='btn-interactive__label';
    while(button.firstChild)label.appendChild(button.firstChild);

    const hover=document.createElement('span');
    hover.className='btn-interactive__hover';
    hover.setAttribute('aria-hidden','true');
    const hoverText=document.createElement('span');
    hoverText.textContent=labelText;
    hover.append(hoverText);
    hover.insertAdjacentHTML('beforeend',ic('arrow'));

    button.classList.add('btn-interactive');
    button.append(label,hover);
  });
}
