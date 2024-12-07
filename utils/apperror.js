 class Apperror extends Error{
    constructor(){
        super()
    }
    create(message,statuscode,statestxt)
    {
        this.message=message;
        this.statuscode=statuscode;
        this.stutestxt=statestxt;
        return this;
    }

 }
 module.exports=new Apperror;