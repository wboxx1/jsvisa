
var ref = require("ref");
var ffi = require("ffi-napi");
var ArrayType = require("ref-array");

// typedef
var ViError = ref.types.int;
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

exports.getVisa = ffi.Library("visa32.dll", {
    "viOpenDefaultRM": [ViError, [ViPSession] ],
    "viOpen": [ViError, [ViSessPtr, ViRsrc, ViAccessMode, ViUint32, ViPSession]],	//viOpen(sesn, rsrcName, accessMode, timeout, vi)
    "viPrintf": [ViError, [ViSessPtr, "string"]],
    "viScanf" : [ViError, [ViSessPtr, "string", ByteArrPtrPtr]],
    "viClose": [ViError, [ViSessPtr]],
    "viStatusDesc": [ViError, [ViSession, ViStatus, ViPStatus]]
});
