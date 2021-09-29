class Test{
    run(){
        let i = 0;

        document.querySelectorAll("li").forEach(li=>{
            i++;
            const f = (li,c) => {
                li.style = `background-color: ${c}; transition: background-color .5s`;
            }

            setTimeout(()=>{
                f(li,'red')
             }, 500 + i*500)
           
            setTimeout(()=>{
                f(li,'transparent')
            }, 1000 + i*500)
        })
    }
}

new Test().run();