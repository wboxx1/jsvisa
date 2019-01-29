/************************************************************

jsvisa

************************************************************/


var ref = require("ref");
var ArrayType = require("ref-array");
var visaLibrary = require("./visaLibrary");
var codes = require("./code-dictionary").codes;
// typedef
var ViSession = ref.types.void;
var ViSessPtr = ref.refType(ViSession);
var ViRsrc = ref.types.CString;
var ViAccessMode = ref.types.uint32;
var ViUint32 = ref.types.uint32;
var ViPSession = ref.refType(ViSessPtr);
var ViStatus = ref.types.int;
var ViStatPtr = ref.refType(ViStatus);
var ViPStatus = ref.refType(ViStatPtr);

// for viScanf
var byte = ref.types.byte;
var ByteArray = ArrayType(byte);
var ByteArrPtr = ref.refType(ByteArray);
var ByteArrPtrPtr = ref.refType(ByteArrPtr);

class Visa
{
    constructor(visaAddress)
    {
        this.visaAddress = visaAddress; 
        this.visa = visaLibrary.getVisa;
        this.session = ref.alloc(ViPSession);
        this.pSession = ref.alloc(ViPSession);
        this.ViError = ref.types.int;
        this.errmsg = ref.alloc(ViPStatus);
    }

    openDefaultRM()
    {
        console.log("Open RM");
        this.viError = this.visa.viOpenDefaultRM(this.session);
        if(this.viError < 0)
        {
            this.visa.viStatusDesc(this.session.deref(), this.viError, this.errmsg);
            throw new Error(this.errmsg.deref());
        }
        return this;
    }

    open()
    {
        console.log("Open");
        this.viError = this.visa.viOpen(this.session.deref(), this.visaAddress, 0, 0, this.pSession);
        if(this.viError < 0)
        {
            this.visa.viStatusDesc(this.session.deref(), this.viError, this.errmsg);
            throw new Error(this.errmsg.deref());
        }
        return this;
    }

    Visa32TestQuery(queryString)
    {

        var resourceManager = "0";
        var viError = 0;
        var session = ref.alloc(ViPSession);
        var pSession = ref.alloc(ViPSession);
        var replyString = "";
        var ByteArray = ArrayType(byte);

        // intialize Buffer
        var replyBuff = new ByteArray(256);
        var counter;
        for  (counter = 0 ; counter < 256 ; counter+=1)
        {
            replyBuff[counter] = 0 ;
        }

        console.log("Open RM");
        viError = visa32.viOpenDefaultRM(session);
        console.log(viError);

        //var this.visaAdress;
        //this.visaAdress = 'GPIB0::22::INSTR'

        console.log("ADDR : " + this.visaAdress);
        viError = visa32.viOpen(session.deref(), this.visaAdress, 0, 0, pSession);

        console.log(viError);

        //var queryString;
        //queryString = "*IDN?";
        viError = visa32.viPrintf(pSession.deref(), queryString + "\n");

        console.log("SEND : " + queryString);

        viError = visa32.viScanf(pSession.deref(), "%s", replyBuff.buffer);
        console.log(viError);

        console.log("Close session.");
        visa32.viClose(pSession.deref());

        // make reply string
        counter = 0;
        while(replyBuff[counter] !== 0)
        {
            replyString +=  String.fromCharCode( replyBuff[counter] );
            counter += 1;
        }

        console.log("RECV : " + replyString);
        return replyString;
    }
}
module.exports = Visa;