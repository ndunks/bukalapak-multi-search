
let template = `<a href="#" class="_bmsqc c-btn c-btn--small c-btn--red c-btn--block" target="_BLANK">Search</a>`;


window['_bms_inject'] = () => {
    if(!window['_bms_values']){
        console.error("No BMS VALUED");
        return;
    }
    let query = Object.keys(window['_bms_values'])
        .map((v, i, a) => `search[${v}]=${window['_bms_values'][v]}`);
    document.querySelectorAll('.c-card__head-actions').forEach(
        (v, i, a) => {
            if(!v.querySelector('._bmsqc')){
                v.innerHTML = v.innerHTML + template;
            }
        }
    )
    document.querySelectorAll('._bmsqc').forEach(
        (v:HTMLLinkElement,i,a) => {
            v.href = (
                v.parentElement.parentElement.parentElement.querySelector('.c-product-seller a') as HTMLLinkElement
                ).href  + query;
        }
    )
};

if(!window['_bms_listener']){
    window['_bms_listener'];
    window.addEventListener('message', (e) => {
        console.log("WINDOWS GOT MESSAGE", e.data);
        if(e.data && e.data.eventId && !e.data.value){
            // got reload trigered?
            window['_bms_inject']()
        }
    });
}
