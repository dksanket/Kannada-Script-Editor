var scriptApp = angular.module('scriptApp',['angularTrix']);

scriptApp.controller('mainCtrl',['$scope','containerService','dataService', mainCtrl]);
function mainCtrl($scope,containerService,dataService)
{
  var lineNoMap = new Map();
  var currentLineNo = 1;
  var editor;
  var firstEnter=false,secondEnter=false;

  $scope.formattingOptions = ['ದೃಶ್ಯ ಶಿರೋನಾಮೆ','ಅಭಿನಯ','ಪಾತ್ರ','ಸಂಭಾಷಣೆ'];
  // $scope.formattingOptions = [
  //   { id: 1, name: 'ದೃಶ್ಯ ಶಿರೋನಾಮೆ' },
  //   { id: 2, name: 'ಅಭಿನಯ' },
  //   { id: 3, name: 'ಪಾತ್ರ' },
  //   { id: 4, name: 'ಸಂಭಾಷಣೆ' }
  // ];
  $scope.scriptText = "";
  $scope.selectedFormat = $scope.formattingOptions[0];
  lineNoMap.set(currentLineNo,$scope.selectedFormat);

  function getLineNumber(ev){
    var textarea = ev.currentTarget;
    // return textarea.value.substr(0, textarea.selectionStart).split("\n").length;
    // var arr = textarea.innerText.split("\n");
    editor = textarea.editorController.editor;

    // var lineNo = textarea.innerText.substr(0, textarea.selectionStart).split("\n").length;
    var lineNo = editor.getDocument().toString().substr(0, textarea.selectionStart).split("\n").length;
    // if(arr.length>1 && arr[arr.length-1]=='' && arr[arr.length-2]=='')
    //   return lineNo-1;
    // console.log(lineNo);
    return lineNo-1;
  }

  $scope.onFormatChange = function(){
    lineNoMap.set(currentLineNo,$scope.selectedFormat);
  }

  $scope['trixInitialize'] = function(e, editor) {
          console.info('Event type:', e.type);
  }

//   $scope.trixInitialize = function(e, editor) {
// 	textDoc = editor.getDocument()
// 	textDoc.toString()  // is a JavaScript string
// }

  // $scope.onKeyPressed = function(ev){
  //   // var code = (ev.keyCode ? ev.keyCode : ev.which);
  //   // if(code == 13) { //Enter keycode
  //   //
  //   // }
  //   currentLineNo = getLineNumber(ev);
  //   var lineNoFormat = lineNoMap.get(currentLineNo);
  //   if(lineNoFormat && lineNoFormat!=$scope.selectedFormat)
  //     $scope.selectedFormat = lineNoFormat;
  //   else if(!lineNoFormat)
  //     autoChooseFormat(currentLineNo);
  // }

  $scope.onCursorChange = function(ev){
    var code = (ev.keyCode ? ev.keyCode : ev.which);
    if(code == 13) { //Enter keycode
      if(firstEnter==true)
        secondEnter=true;
      firstEnter = true;
    }
    else {
      firstEnter = false;
      secondEnter=false;
    }
    currentLineNo = getLineNumber(ev);
    var lineNoFormat = lineNoMap.get(currentLineNo);
    if(lineNoFormat && lineNoFormat!=$scope.selectedFormat && !secondEnter)
      $scope.selectedFormat = lineNoFormat;
    else if(!lineNoFormat || secondEnter)
      autoChooseFormat(currentLineNo);
  }

  function autoChooseFormat(lineNo){
    var selectedFormatIndex = $scope.formattingOptions.indexOf($scope.selectedFormat);
    $scope.selectedFormat = $scope.formattingOptions[(selectedFormatIndex+1)%$scope.formattingOptions.length];

    if(selectedFormatIndex==$scope.formattingOptions.length-1 && !secondEnter){
      editor.decreaseIndentationLevel();
      $scope.selectedFormat = $scope.formattingOptions[$scope.formattingOptions.length-2];
    }
    else if(selectedFormatIndex==$scope.formattingOptions.length-2 && secondEnter){
      $scope.selectedFormat = $scope.formattingOptions[0];
    }

    lineNoMap.set(lineNo,$scope.selectedFormat);

    if(editor){
      switch($scope.selectedFormat){
        case 'ದೃಶ್ಯ ಶಿರೋನಾಮೆ':{
          // editor.deactivateAttribute("bullet");
          editor.deactivateAttribute("code");
          editor.deactivateAttribute("quote");
        }
        break;
        case 'ಸಂಭಾಷಣೆ':{
          editor.activateAttribute("bullet");
        }
        break;
        case 'ಪಾತ್ರ':{
          editor.deactivateAttribute("bullet");
          if(selectedFormatIndex==$scope.formattingOptions.length-1 && !secondEnter)
            editor.decreaseIndentationLevel();
          editor.activateAttribute("code");
        }
        break;
        case 'ಅಭಿನಯ':{
          editor.deactivateAttribute("bullet");
          editor.activateAttribute("quote");
        }
        break;
      }
    }
  }
};

scriptApp.service('containerService', [function() {
}]);

scriptApp.service('dataService', [function() {
}]);

// scriptApp.config(['$provide', function($provide){
// 		// this demonstrates how to register a new tool and add it to the default toolbar
// 		$provide.decorator('taOptions', ['$delegate', function(taOptions){
// 			// $delegate is the taOptions we are decorating
// 			// here we override the default toolbars and classes specified in taOptions.
// 			taOptions.forceTextAngularSanitize = true; // set false to allow the textAngular-sanitize provider to be replaced
// 			taOptions.keyMappings = []; // allow customizable keyMappings for specialized key boards or languages
// 			taOptions.toolbar = [
// 				['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
// 				['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
// 				['justifyLeft','justifyCenter','justifyRight', 'justifyFull'],
// 				['html', 'insertImage', 'insertLink', 'wordcount', 'charcount']
// 			];
// 			taOptions.classes = {
// 				focussed: 'focussed',
// 				toolbar: 'btn-toolbar',
// 				toolbarGroup: 'btn-group',
// 				toolbarButton: 'btn btn-default',
// 				toolbarButtonActive: 'active',
// 				disabled: 'disabled',
// 				textEditor: 'form-control',
// 				htmlEditor: 'form-control'
// 			};
// 			return taOptions; // whatever you return will be the taOptions
// 		}]);
// 		// this demonstrates changing the classes of the icons for the tools for font-awesome v3.x
// 		$provide.decorator('taTools', ['$delegate', function(taTools){
// 			taTools.bold.iconclass = 'icon-bold';
// 			taTools.italics.iconclass = 'icon-italic';
// 			taTools.underline.iconclass = 'icon-underline';
// 			taTools.ul.iconclass = 'icon-list-ul';
// 			taTools.ol.iconclass = 'icon-list-ol';
// 			taTools.undo.iconclass = 'icon-undo';
// 			taTools.redo.iconclass = 'icon-repeat';
// 			taTools.justifyLeft.iconclass = 'icon-align-left';
// 			taTools.justifyRight.iconclass = 'icon-align-right';
// 			taTools.justifyCenter.iconclass = 'icon-align-center';
// 			taTools.clear.iconclass = 'icon-ban-circle';
// 			taTools.insertLink.iconclass = 'icon-link';
// 			taTools.insertImage.iconclass = 'icon-picture';
// 			// there is no quote icon in old font-awesome so we change to text as follows
// 			delete taTools.quote.iconclass;
// 			taTools.quote.buttontext = 'quote';
// 			return taTools;
// 		}]);
// 	}]);
