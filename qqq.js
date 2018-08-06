(function (window, document, undefined) { 
'use strict'; 
// 确保 ValidityState 全部被支持 (所有的功能)
 var supported = function () { 
 var input = document.createElement('input'); 
 return ('validity' in input && 'badInput' in input.validity && 'patternMismatch' in input.validity && 'rangeOverflow' in input.validity && 'rangeUnderflow' in input.validity && 'stepMismatch' in input.validity && 'tooLong' in input.validity && 'tooShort' in input.validity && 'typeMismatch' in input.validity && 'valid' in input.validity && 'valueMissing' in input.validity); }; 
 /** * Generate the field validity object
  * @param {Node]} field The field to validate 
 * @return {Object} The validity object */
  var getValidityState = function (field) { 
  // 变量 
  var type = field.getAttribute('type') || input.nodeName.toLowerCase(); 
  var isNum = type === 'number' || type === 'range'; 
  var length = field.value.length; 
  var valid = true; 
  //检测支持性 
  var checkValidity = { 
  badInput: (isNum && length > 0 && !/[-+]?[0-9]/.test(field.value)), 
  // 数字字段的值不是数字 
  patternMismatch: (field.hasAttribute('pattern') && length > 0 && new RegExp(field.getAttribute('pattern')).test(field.value) === false), 
  // 输入的值不符合模式 
  rangeOverflow: (field.hasAttribute('max') && isNum && field.value > 1 && parseInt(field.value, 10) > parseInt(field.getAttribute('max'), 10)), 
  // 数字字段的值大于max属性值 
  /rangeUnderflow: (field.hasAttribute('min') && isNum && field.value > 1 && parseInt(field.value, 10) < parseInt(field.getAttribute('min'), 10)), 
  // 数字字段的值小于min属性值 
  stepMismatch: (field.hasAttribute('step') && field.getAttribute('step') !== 'any' && isNum && Number(field.value) % parseFloat(field.getAttribute('step')) !== 0), 
  // 数字字段的值不符合 
  /stepattribute tooLong: (field.hasAttribute('maxLength') && field.getAttribute('maxLength') > 0 && length > parseInt(field.getAttribute('maxLength'), 10)), 
  // 用户在具有maxLength属性的字段中输入的值的长度大于属性值 
  tooShort: (field.hasAttribute('minLength') && field.getAttribute('minLength') > 0 && length > 0 && length < parseInt(field.getAttribute('minLength'), 10)),
  // 用户在具有minLength属性的字段中输入的值的长度小于属性值 
  typeMismatch: (length > 0 && ((type === 'email' && !/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(field.value)) || (type === 'url' && !/^(?:(?:https?|HTTPS?|ftp|FTP):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*)(?::\d{2,5})?(?:[\/?#]\S*)?$/.test(field.value)))), 
  // email 或者 URL 字段的值不是一个 email地址或者 URL 
  valueMissing: (field.hasAttribute('required') && (((type === 'checkbox' || type === 'radio') && !field.checked) || (type === 'select' && field.options[field.selectedIndex].value < 1) || (type !=='checkbox' && type !== 'radio' && type !=='select' && length < 1))) 
  // 必填字段没有值 
  }; 
  
  //检查是否有错误 
  for (var key in checkValidity) { 
  if (checkValidity.hasOwnProperty(key)) { 
  // If there's an error, change valid value 
    if (checkValidity[key]) {
       valid = false;
       break;
    }
   } 
  } 
 //给 validity对象添加valid属性 
 checkValidity.valid = valid; 
 // 返回对象 
 return checkValidity; 
 }; 
 //如果不支持完整的ValidityState功能，则可以使用polyfill 
 if (!supported()) { 
 	Object.defineProperty(HTMLInputElement.prototype, 'validity', {
 	 get: function ValidityState() { 
 	 	return getValidityState(this); 
 	 }, 
 	 configurable: true, 
 	}); 
 } 
 })(window, document);