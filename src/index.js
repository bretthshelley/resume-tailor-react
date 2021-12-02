import parse from 'html-react-parser';
import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import { Fragment } from 'react/cjs/react.production.min';
import './index.css';
import axios from 'axios';


const keywordsDefaultText='Keyword(s) separated by commas';
const startFromDefaultText='Optional word or phrase';
const endAtDefaultText='Optional word or phrase';
const keepDefaultText='Optional words or phrases separated by commas';
const underlineText='Underline';
const italicizeText='Italicize';
const highlightText='Highlight';
const boldfaceText='Boldface';
const keepText="Keep:";
const findReplaceHint="Hint: You might replace the words 'Resume Title' with the Job Title you are applying for.";
const startFromText='Start from:';
const endAtText='End at:';
const removeBulletsHint="Explanation: This removes bullet paragraphs without keyword matches. 'Start From' defines the word or phrase where bullet removal begins in the Word document. 'End at' defines the word or phrase where bullet removal ends. 'Keep' words keeps bullets even though they have no matching keywords.";
const replaceDefaultText='';
const searchDefaultText='';
const wordFileType='application/vnd.openxmlformats-officedocument.wordprocessingml.document';


const highlightColorOptions = [
  { value: 'yellow',label: 'Yellow'},
  { value: 'green',label: 'Green'},
  { value: 'lightGray',label: 'Light Gray'},
  { value: 'magenta',label: 'Magenta'},
  { value: 'red',label: 'Red'},
  { value: 'blue',label: 'Blue'},
  { value: 'cyan',label: 'Cyan'},
  { value: 'darkBlue',label: 'Dark Blue'},
  { value: 'darkCyan',label: 'Dark Cyan'},
  { value: 'darkGray',label: 'Dark Gray'},
  { value: 'darkMagenta',label: 'Dark Magenta'},
  { value: 'darkRed',label: 'Dark Red'},
  { value: 'darkYellow',label: 'Dark Yellow'},
  { value: 'darkGreen',label: 'Dark Green'},
  { value: 'black', label: 'Black' },
  { value: 'white',label: 'White'},
];

const foregroundStyleMap = {
  yellow: 'black',
  green: 'white',
  lightGray: 'black',
  magenta: 'white',
  red: 'white',
  blue: 'white',
  cyan: 'black',
  darkBlue: 'white',
  darkCyan: 'white',
  darkGray: 'white',
  darkMagenta: 'white',
  darkRed: 'white',
  darkYellow: 'black',
  darkGreen: 'white',
  black: 'white',
  white: 'black',
};

const backgroundStyleMap = {
  yellow: 'yellow',
  green: 'green',
  lightGray: 'lightGray',
  magenta: 'magenta',
  red: 'red',
  blue: 'blue',
  cyan: 'cyan',
  darkBlue: 'darkBlue',
  darkCyan: 'darkCyan',
  darkGray: 'darkGray',
  darkMagenta: 'darkMagenta',
  darkRed: 'darkRed',
  darkYellow: '#CCCC00',
  darkGreen: 'darkGreen',
  black: 'black',
  white: 'white',
};

const colourStyles = {
  singleValue: (provided, { data }) => ({
    ...provided,
    color: foregroundStyleMap[data.value] ? foregroundStyleMap[data.value] : 'black',
    background: backgroundStyleMap[data.value] ? backgroundStyleMap[data.value] : 'white',
    innerWidth: 200,
    outerWidth: 220,
  }),
};

function HighlightColorSelect(props) {

  let highlightColorChangeHandler= props.highlightColorChangeHandler;
  let highlightColor=props.highlightColor;
  let highlightColorLabel=props.highlightColorLabel;

  let highlightDefaultValue={ label: highlightColorLabel, value: highlightColor };

  return (
    <div style={{marginLeft:'120px',marginTop:'10px'}}>
      <div style={{width:'170px'}}>
        <Select
          options={highlightColorOptions}
          styles={colourStyles}
          onChange={(e)=>highlightColorChangeHandler(e)}
          defaultValue={highlightDefaultValue}
          menuPlacement="auto"
          menuPosition="fixed"
        />
      </div>
    </div>
  );
}

class ResumeTailorForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      keywords:'',
      styleKeywords: true,
      underline: false,
      underlineApproach: 'keyword',
      italicize: false,
      italicizeApproach: 'keyword',
      highlight: false,
      highlightApproach: 'keyword',
      highlightColor:'yellow',
      highlightColorLabel: 'Yellow',
      boldface: false,
      boldfaceApproach: 'keyword',
      selectedOption: null,
      searchReplace: false,
      search: '',
      replace: '',
      removeBullets: false,
      startFrom:'',
      endAt:'',
      keep:'',
      brackets: false,
      showBracketDetails: false,
      validationErrors:[],
      validationInProgress: false,
      mainRequestBody:'',
      selectedFile: null,
      uploadError: null, 
      uploadResponse: null,
    };

    
  }

    onFileChange = e =>{
      console.log("selected file target: " + String(e.target.files[0]));
      this.setState({ selectedFile: e.target.files[0]});
    }

  doResumeUpload = () => { 
    this.setState({uploadError: null, uploadResponse: null})
    console.log("doResumeUpload");
    const formData = new FormData(); 
   
    formData.append( 
      "file", 
      this.state.selectedFile, 
      this.state.selectedFile.name 
    ); 

    const mainRequestBody = this.buildMainRequestBody();
    formData.append("json", mainRequestBody);
    console.log("about to do resume upload");
    axios.post("resume/upload", formData, {
      /// ... headers are set automagically. You are supposed to have those undefined.
      // headers: {
      //   'Content-Type':'multipart/form-data'
      // }
    })
      .then(res => {
        console.log("Upload Response: " + {res});
      }).catch(err => {
        console.error("Upload Error: " + {err});
        console.log("error status: " +err.response.status);
        this.setState({uploadError: err})
      });
  }; 


  doSubmit(){
    console.log("doSubmit");
    this.setState({validationInProgress:true});
    
    if ( this.isInputValid()){
      let mainRequestBody=this.buildMainRequestBody();
      this.setState({mainRequestBody: mainRequestBody});
      this.doResumeUpload();
    }

  }

  buildMainRequestBody(){
    let body='{'

    let keywordStyleRequest= this.buildKeywordStyleRequest();
    body+=keywordStyleRequest;
    
    let searchAndReplaceRequest= this.buildSearchAndReplaceRequest();
    if ( body!=='{'){
      body+=',';
    }
    body+=searchAndReplaceRequest;

    let trimBulletsRequest = this.buildTrimBulletsRequest();
    if ( body!=='{' && body.endsWith(',')!==true){
      body+=',';
    }
    body+=trimBulletsRequest;

    if ( body!=='{' && body.endsWith(',')!==true){
      body+=',';
    }
    body+='"removeKeywordlessBullets":'+this.state.removeBullets;
    if ( body!=='{' && body.endsWith(',')!==true){
      body+=',';
    }
    body+='"removeBracketedStrings":'+this.state.brackets;

    body+='}'
    return body;
  }

  buildTrimBulletsRequest(){
    let request='';
    if ( this.state.removeBullets===false){
      return request;
    }
    request+='"trimBulletsRequest": {';
    if ( this.state.startFrom!==''){
      request+='"fromMarker": '+JSON.stringify(this.state.startFrom)+',';
    }
    if ( this.state.endAt!==''){
      request+='"toMarker": '+JSON.stringify(this.state.endAt)+',';
    }
    if ( this.state.keep!==''){
      request+='"keepBulletMarkers": ' + JSON.stringify(this.buildKeepWordsArray());
    }
    if ( request.endsWith(",")){
      request = request.substring(0, request.length-1);
    }
    request+="}"
    return request;
  }

  buildSearchAndReplaceRequest(){
    let request='';
    if ( this.state.searchReplace===false)
    {
      return request;
    }
    request+='"searchAndReplaceRequest":{"searchReplaceMap":{';
    request+=JSON.stringify(this.state.search);
    request+=': ';
    request+=JSON.stringify(this.state.replace)
    request+='}}';
    return request;
  }

  buildKeepWordsArray()
  {
    let keepArray = [];    
    if ( this.state.keep.indexOf(",")===-1){
      keepArray.push(this.state.keep.trim());
      return keepArray;
    }

    const tempArray = this.state.keep.split(",");
    tempArray.forEach(
      function(item){
        let itemTrimmed = item.trim();
        if ( itemTrimmed!==''){
          keepArray.push(itemTrimmed);
        }        
       }
    )
    return keepArray;
  }


  buildKeywordsArrayString()
  {
    let keywordArray = [];    
    if ( this.state.keywords.indexOf(",")===-1){
      keywordArray.push(this.state.keywords.trim());
      return JSON.stringify(keywordArray);
    }

    const tempArray = this.state.keywords.split(",");
    tempArray.forEach(
      function(item){
        let itemTrimmed = item.trim();
        if ( itemTrimmed!==''){
          keywordArray.push(itemTrimmed);
        }        
       }
    )
    return JSON.stringify(keywordArray);
  }

  buildKeywordStyleRequest(){
    let request='';
    if ( this.state.styleKeywords===false)
    {
      return request;
    }

    request+='"keywordStyleRequest": {';    
    request+='"highlightKeywords":'+((this.state.highlight) && (this.state.highlightApproach==='keyword'))+",";
    request+='"highlightSentence":'+(this.state.highlight && this.state.highlightApproach==='sentence')+",";
    request+='"boldfaceKeywords":'+(this.state.boldface && this.state.boldfaceApproach==='keyword')+",";
    request+='"boldfaceSentence":'+(this.state.boldface && this.state.boldfaceApproach==='sentence')+",";
    request+='"italicizeKeywords":'+(this.state.italicize && this.state.italicizeApproach==='keyword')+",";
    request+='"italicizeSentence":'+(this.state.italicize && this.state.italicizeApproach==='sentence')+",";
    request+='"underlineKeywords":'+(this.state.underline && this.state.underlineApproach==='keyword')+",";
    request+='"underlineSentence":'+(this.state.underline && this.state.underlineApproach==='sentence')+",";
    request+='"highlightColor":"'+(this.state.highlightColor)+'",';
    request+='"keywords":'+this.buildKeywordsArrayString();
    request+="}";
    return request;
  }

  isInputValid(){

    if ( !this.state.styleKeywords && !this.state.searchReplace && !this.state.removeBullets && !this.state.brackets){
      console.log("no options selected");
      return false;     
    }
  
    if ( this.state.styleKeywords ){
      if (!this.state.underline && !this.state.italicize && !this.state.boldface && !this.state.highlight)
      {
        console.log("no styling options selected");
        return false;
      }
      if ( this.state.keywords.trim()===''){
        console.log("no keywords added");
        return false;
      }
    }
  
    if ( this.state.searchReplace ){
      if (this.state.search.trim()==='' && this.state.replace.trim()==='' )
      {
        console.log("no search/replace criteria defined");
        return false;
      }
      if (this.state.search.trim()==='' && this.state.replace.trim()!=='' ){
        console.log("no search criteria defined to replace");
         return false;
      }
    }
    let maxSize=6291456;
    if ( this.state.selectedFile===null ){
      console.log("no file selected");
      return false;
    }
    else if (this.state.selectedFile.name.toLowerCase().endsWith(".docx")!==true){
      console.log("selected file not a .docx");
      return false;
    }
    else if ( this.state.selectedFile.type !== wordFileType){
      console.log("selected file not word document type");
      return false;
    }
    else if ( this.state.selectedFile.size>maxSize){
      console.log("max file size exceeded");
      return false;
    }
    return true;
  }


  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
  };





  keywordsOnBlurHandler(e){
    let keywords = e.target.value.trim();
    if ( keywords===keywordsDefaultText)
    {
      keywords='';
    }
    if ( keywords===''){
      e.target.value=keywordsDefaultText;
    }
    this.setState({
      keywords: keywords,
    })
  }

  keywordsOnFocusHandler(e){
    let keywords = this.state.keywords;
    e.target.value=keywords;
  }

  startFromOnFocusHandler(e){
    let startFrom = this.state.startFrom;
    e.target.value=startFrom;
  }

  startFromOnBlurHandler(e){
    let startFrom = e.target.value.trim();
    if ( startFrom===startFromDefaultText)
    {
      startFrom='';
    }
    if ( startFrom===''){
      e.target.value=startFromDefaultText;
    }
    this.setState({
      startFrom: startFrom,
    })
  }

  endAtOnFocusHandler(e){
    let endAt = this.state.endAt;
    e.target.value=endAt;
  }

  endAtOnBlurHandler(e){
    let endAt = e.target.value.trim();
    if ( endAt===endAtDefaultText)
    {
      endAt='';
    }
    if ( endAt===''){
      e.target.value=endAtDefaultText;
    }
    this.setState({
      endAt: endAt,
    })
  }

  keepOnFocusHandler(e){
    let keep = this.state.keep;
    e.target.value=keep;
  }

  keepOnBlurHandler(e){
    let keep = e.target.value.trim();
    if ( keep===keepDefaultText)
    {
      keep='';
    }
    if ( keep===''){
      e.target.value=keepDefaultText;
    }
    this.setState({
      keep: keep,
    })
  }

  searchOnFocusHandler(e){
    let search = this.state.search;
    e.target.value=search;
  }

  searchOnBlurHandler(e){
    let search = e.target.value.trim();
    if ( search===searchDefaultText)
    {
      search='';
    }
    if ( search===''){
      e.target.value=searchDefaultText;
    }
    this.setState({
      search: search,
    })
  }

  replaceOnFocusHandler(e){
    let replace = this.state.replace;
    e.target.value=replace;
  }

  replaceOnBlurHandler(e){
    let replace = e.target.value.trim();
    if ( replace===replaceDefaultText)
    {
      replace='';
    }
    if ( replace===''){
      e.target.value=replaceDefaultText;
    }
    this.setState({
      replace: replace,
    })
  }

  handleStartFromChange(e){
    let val = e.target.value.trim();
    if ( val.trim()===startFromDefaultText){
      val='';      
    }
    if ( val.trim()===''){
      e.target.value=startFromDefaultText;
    }
    this.setState({ startFrom: val })
  }

  handleEndAtChange(e){
    let val = e.target.value.trim();
    if ( val.trim()===endAtDefaultText){
      val='';
    }
    if ( val.trim()===''){
      e.target.value=endAtDefaultText;
    }
    this.setState({ endAt: val })
  }

  handleDontRemoveChange(e){
    let val = e.target.value.trim();
    if ( val.trim()===keepDefaultText){
      val='';
    }
    if ( val.trim()===''){
      e.target.value=keepDefaultText;
    }
    this.setState({ keep: val })
  }

  handleReplaceChange(e){
    let val = e.target.value.trim();
    this.setState({ replace: val })
  }

  handleHighlightColorChange(e){
    this.setState({
      highlightColor: String(e.value),
      highlightColorLabel: e.label
    })
  }

  getSpanStyleForColor( color){
    return "<span className='"+color+"Highlight'>";
  }


  getExampleSentence(){

    let sent1='Example: ';
    
    let boldfaceSentence=this.state.boldface && this.state.boldfaceApproach==='sentence';
    let italicizeSentence=this.state.italicize && this.state.italicizeApproach==='sentence';
    let underlineSentence=this.state.underline && this.state.underlineApproach==='sentence';
    let highlightSentence = this.state.highlight && this.state.highlightApproach==='sentence';

    let boldfaceKeyword=this.state.boldface && this.state.boldfaceApproach==='keyword';
    let italicizeKeyword=this.state.italicize && this.state.italicizeApproach==='keyword';
    let underlineKeyword=this.state.underline && this.state.underlineApproach==='keyword';
    let highlightKeyword=this.state.highlight && this.state.highlightApproach==='keyword';

    sent1+=boldfaceSentence?'<b>':'';
    sent1+=italicizeSentence?'<i>':'';
    sent1+=underlineSentence?'<u>':'';
    sent1+=highlightSentence? this.getSpanStyleForColor(this.state.highlightColor):'';

    sent1+='This sentence contains keywords ';
    
    sent1+=boldfaceKeyword?'<b>':'';
    sent1+=italicizeKeyword?'<i>':'';
    sent1+=underlineKeyword?'<u>':'';
    sent1+=highlightKeyword? this.getSpanStyleForColor(this.state.highlightColor):'';
    sent1+='Java';
    sent1+=highlightKeyword? '</span>':'';
    sent1+=underlineKeyword?'</u>':'';
    sent1+=italicizeKeyword?'</i>':'';
    sent1+=boldfaceKeyword?'</b>':'';

    sent1+=" and ";

    sent1+=boldfaceKeyword?'<b>':'';
    sent1+=italicizeKeyword?'<i>':'';
    sent1+=underlineKeyword?'<u>':'';
    sent1+=highlightKeyword? this.getSpanStyleForColor(this.state.highlightColor):'';
    sent1+='Oracle';
    sent1+=highlightKeyword? '</span>':'';
    sent1+=underlineKeyword?'</u>':'';
    sent1+=italicizeKeyword?'</i>':'';
    sent1+=boldfaceKeyword?'</b>':'';
    sent1+="."

    sent1+=highlightSentence? '</span>':'';
    sent1+=underlineSentence?'</u>':'';
    sent1+=italicizeSentence?'</i>':'';
    sent1+=boldfaceSentence?'</b>':'';
    
    sent1+=" This second sentence has no keywords and will not be styled."
    return sent1;

  }

  htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }
 
  render() {
    return (
      <div>

        <UploadErrorsSection
          uploadError={this.state.uploadError}
        />

        {this.state.validationInProgress?
        <ValidationSection 
          validationErrors={this.state.validationErrors} 
          styleKeywords= {this.state.styleKeywords}
          searchReplace={this.state.searchReplace}
          removeBullets={this.state.removeBullets}
          brackets={this.state.brackets}
          underline = {this.state.underline}
          italicize = {this.state.italicize}
          boldface = {this.state.boldface}
          highlight= {this.state.highlight}
          keywords = {this.state.keywords}
          search = {this.state.search}
          replace = {this.state.replace}
          selectedFile = {this.state.selectedFile}
        />
        :''}

        <div className="facet-group-header-text">Select A Resume</div>
        <hr className="rounded"/>
       
        
        <div> 
          <input type="file" onChange={this.onFileChange} /> 
        </div> 

        <div className="facet-group-header-text">Add Keywords</div>
        <hr className="rounded"/>

        <KeywordEntry 
          keywordsOnBlurHandler={this.keywordsOnBlurHandler.bind(this)} 
          keywordsOnFocusHandler={this.keywordsOnFocusHandler.bind(this)}/>

        <div className="facet-group-header-text">Choose Tailoring Options</div>
        <hr className="rounded"/>
       
        <KeywordStyleSection 
          styleKeywords={this.state.styleKeywords}
          styleKeywordsChangeHandler={this.handleStyleKeywordsChange.bind(this)}
          changeHandler={this.handleStylingChange.bind(this)} 
          approachHandler={this.handleApproach.bind(this)}
          highlight={this.state.highlight}
          highlightColor={this.state.highlightColor}
          highlightColorLabel={this.state.highlightColorLabel}
          highlightColorChangeHandler = { this.handleHighlightColorChange.bind(this)}
          italicizeApproach={ this.state.italicizeApproach}
          underlineApproach={ this.state.underlineApproach}
          boldfaceApproach={this.state.boldfaceApproach}
          highlightApproach={this.state.highlightApproach}
          underline={this.state.underline}
          italicize={this.state.italicize}
          boldface={this.state.boldface}
        /> 
        {this.state.styleKeywords?<div className="example-sentence-indented">{parse(this.getExampleSentence())}</div>:''} 

        <SearchAndReplaceSection
          searchReplaceOnChangeHandler={this.searchReplaceOnChangeHandler.bind(this)}
          searchOnFocusHandler={this.searchOnFocusHandler.bind(this)}
          searchOnBlurHandler={this.searchOnBlurHandler.bind(this)}
          replaceOnFocusHandler={this.replaceOnFocusHandler.bind(this)}
          replaceOnBlurHandler={this.replaceOnBlurHandler.bind(this)}
          search={this.state.search}
          replace={this.state.replace}
          searchReplace={this.state.searchReplace}
        />

        <BulletTrimmingSection
          removeBulletsChangeHandler={this.handleDeleteBulletsChange.bind(this)}
          removeBullets={this.state.removeBullets}
          startFrom={this.state.startFrom}
          endAt={this.state.endAt}
          keep={this.state.keep}
          startFromOnFocusHandler={this.startFromOnFocusHandler.bind(this)}
          startFromOnBlurHandler={this.startFromOnBlurHandler.bind(this)}
          endAtOnFocusHandler={this.endAtOnFocusHandler.bind(this)}
          endAtOnBlurHandler={this.endAtOnBlurHandler.bind(this)}
          keepOnFocusHandler={this.keepOnFocusHandler.bind(this)}
          keepOnBlurHandler={this.keepOnBlurHandler.bind(this)}
        />
     
        <BracketSection 
          bracketsChangeHandler={this.handleBracketsChange.bind(this)} 
          bracketsOnClickHandler={this.handleBracketsOnClick.bind(this)}
          showBracketDetails={this.state.showBracketDetails}
          brackets={this.state.brackets}
        />
         <p><input type="button" onClick={this.doSubmit.bind(this)} value="Submit"/></p>
       
      </div>
    );
  }

  handleUnderlineChange(e) { this.setState({ underline: e.target.checked, }); }

  handleDeleteBulletsChange(e){ this.setState({ removeBullets: e.target.checked, }); }

  searchReplaceOnChangeHandler(e){ this.setState({ searchReplace: e.target.checked, }); }

  handleStyleKeywordsChange(e){ this.setState({ styleKeywords: e.target.checked, }); }

  handleBracketsChange(e){ this.setState({ brackets: e.target.checked }) }

  handleBracketsOnClick(e){ 
    this.setState({showBracketDetails: !this.state.showBracketDetails})
  }


  handleStylingChange(e) { 

    let isUnderlineCheckbox = 'UnderlineCheckbox'=== e.target.id;
    let isItalicizeCheckbox = 'ItalicizeCheckbox'=== e.target.id;
    let isHighlightCheckbox = 'HighlightCheckbox'=== e.target.id;
    let isBoldfaceCheckbox = 'BoldfaceCheckbox'=== e.target.id;
    let checkedValue= e.target.checked;

    if ( isUnderlineCheckbox){
      this.setState({ underline: checkedValue});
    } 
    else if ( isItalicizeCheckbox){
      this.setState({italicize: checkedValue});
    }  
    else if ( isHighlightCheckbox){
      this.setState({highlight: checkedValue});
    } 
    else if ( isBoldfaceCheckbox){
      this.setState({boldface: checkedValue});
    } 
  }

  

  handleApproach(e){

    let isUnderlineApproach = 'UnderlineApproach'=== e.target.id;
    let isItalicizeApproach = 'ItalicizeApproach'=== e.target.id;
    let isHighlightApproach = 'HighlightApproach'=== e.target.id;
    let isBoldfaceApproach = 'BoldfaceApproach'=== e.target.id;
    
    let approach=e.target.value;

    if ( isUnderlineApproach){
      this.setState({underlineApproach: approach});
    }
    else if ( isItalicizeApproach){
      this.setState({italicizeApproach: approach});
    }
    else if ( isHighlightApproach){
      this.setState({highlightApproach: approach});
    }
    else if ( isBoldfaceApproach){
      this.setState({boldfaceApproach: approach});
    }
  }

}

function UploadErrorsSection( props){
  let uploadError= props.uploadError;

  let errors= [];

  if ( uploadError!==null ){
    let message = "Upload Error occurred with status " + uploadError.response.status ;
    errors.push(message);
  }

  let errorHtml='';
  errors.forEach(
    function(d){
      errorHtml += '<img src="./error-icon.png" alt="errors present" className="validation-image"/> ' + d + '<br/>'
     }
  )

  return (
    <Fragment>
      {errors.length>0?
    <div className="validation-message">
      {parse(errorHtml)}
    </div>
    :''}
    </Fragment>
  )

}

function ValidationSection( props)
{
  let styleKeywords= props.styleKeywords;
  let searchReplace=props.searchReplace;
  let removeBullets=props.removeBullets;
  let brackets=props.brackets;
  let underline = props.underline;
  let italicize = props.italicize;
  let boldface = props.boldface;
  let highlight= props.highlight;
  let keywords = props.keywords;
  let search = props.search;
  let replace = props.replace;
  let selectedFile = props.selectedFile;

  let errors= [];//this.state.validationErrors.slice();
  if ( !styleKeywords && !searchReplace && !removeBullets && !brackets){
    errors.push("Missing option(s): Select at least one option (Style Keywords, Find and Replace, Remove Bullets..., Remove Brackets...)");     
  }

  if ( styleKeywords ){
    if (!underline && !italicize && !boldface && !highlight)
    {
      errors.push("Missing style option(s): Select one or more options (italicize,underline,boldface,highlight)");
    }
    if ( keywords.trim()===''){
      errors.push("Missing keyword(s): Enter at least one keyword to style");
    }
  }

  if ( searchReplace ){
    if (search.trim()==='' && replace.trim()==='' )
    {
      errors.push("Missing Find and Replace Values: Enter values or deselect 'Find and Replace'");
    }
    if (search.trim()==='' && replace.trim()!=='' ){

      errors.push("Missing 'Find what' value: Enter a value");
    }
  }
  let maxSize=6291456;
  if ( selectedFile===null ){
    errors.push("No file selected");
  }
  else if (selectedFile.name.toLowerCase().endsWith(".docx")!==true){
    errors.push("Invalid Resume Format: 'Choose File' in Word .docx format");
  }
  else if ( selectedFile.type !== wordFileType){
    errors.push("Invalid Resume Format: Word .docx format must be of type " + wordFileType);
  }
  else if ( selectedFile.size>maxSize){
    errors.push("Uploaded File cannot be greater than 6 MB");
  }

  let errorHtml='';
  errors.forEach(
    function(d){
      errorHtml += '<img src="./error-icon.png" alt="errors present" className="validation-image"/> ' + d + '<br/>'
     }
  )

  return (
    <Fragment>
      {errors.length>0?
    <div className="validation-message">
      {parse(errorHtml)}
    </div>
    :''}
    </Fragment>
  )

}


function BracketSection(props){

  let bracketsChangeHandler=props.bracketsChangeHandler;
  let bracketsOnClickHandler=props.bracketsOnClickHandler;
  let showBracketDetails=props.showBracketDetails;
  let brackets=props.brackets;

  return(
    <div>
      <div className='facet-group-option' >
        <div className="keyword-styling-line">
            <input type='checkbox' id='bracketsCheckbox' onChange={(e)=>bracketsChangeHandler(e)}/>
        </div>
        <div className="keyword-styling-line">
          <span className="remove-bullets-styling-label">Remove Brackets (Advanced)</span>
        </div>
      </div>
      <div className="search-replace-line"><span className="indent-span"></span></div>
      {brackets? <BracketDetails showBracketDetails={showBracketDetails} bracketsOnClickHandler={bracketsOnClickHandler}/>:''}
    </div>

  );
}





function BracketDetails(props){
  let bracketsOnClickHandler=props.bracketsOnClickHandler;
  let showBracketDetails=props.showBracketDetails;

  return (
    <Fragment>

  {showBracketDetails?
    
    <div className="show-bracket-details">
    <input type="button" value="Hide Explanation..." id="hideBracketDetails" onClick={(e)=>bracketsOnClickHandler(e)}/>
    <p>'Removing Brackets' hides the rapid customization magic from those who view the document.
      'Remove Brackets' removes the texts inside brackets so you may use keyword matching without showing the keyword. 
      <br/> For example, imagine the following bullets in a resume:
      <ul>
        <li>Filled in as the Team's Database administrator [#Oracle,#DBA,#keepme,#leadership].</li>
      </ul>
      Selecting 'Remove Brackets' results in the following modified bullets. 
      <ul>
        <li>Filled in as the Team's Database administrator.</li>
      </ul>
      This advanced capability enables you to rapidly trim down a 'big' resume to match a specific job requirement. 
      Imagine a resume with 20 bullets. And you want to only keep the six bullets with '#leadership' in brackets.  
      Selecting both 'Remove Bullets without keywords' and 'Remove Brackets', then adding '#leadership' as a 'Keep' word allows you to do this.
      And if you always want to show a bulleted paragraph, then adding a 'Keep' marker like '#keepme' enables this.   
    </p>
    <p>Using this feature takes a bit of thought and preparation.  But if you want to produce a resume that is exactly focused on a job requirement, 
      then this feature is extremely powerful. 
    </p>
    </div>

  :
  <div className="search-replace-line">
    <input type="button" value="Show Explanation..." id="showBracketDetails" onClick={(e)=>bracketsOnClickHandler(e)}/>
  </div>
  }
  </Fragment>
  );

}



function BulletTrimmingSection(props){

  let removeBulletsChangeHandler= props.removeBulletsChangeHandler;
  let removeBullets=props.removeBullets;
  let startFromOnFocusHandler=props.startFromOnFocusHandler;
  let endAtOnFocusHandler=props.endAtOnFocusHandler;
  let keepOnFocusHandler=props.keepOnFocusHandler;
  let startFromOnBlurHandler=props.startFromOnBlurHandler;
  let endAtOnBlurHandler=props.endAtOnBlurHandler;
  let keepOnBlurHandler=props.keepOnBlurHandler;

  let startFrom=props.startFrom;
  let endAt=props.endAt;
  let keep=props.keep;

  return (
    <div>
      <div className='facet-group-option' >
        <div className="keyword-styling-line">
            <input type='checkbox' id='removeBulletsCheckbox' onChange={(e)=>removeBulletsChangeHandler(e)}/>
        </div>
        <div className="keyword-styling-line">
          <span className="remove-bullets-styling-label">Remove Bullets without keywords</span>
        </div>
      </div>
      <div>
        <OptionalTextLine show={removeBullets} onFocusHandler={startFromOnFocusHandler} onBlurHandler={startFromOnBlurHandler} labelText={startFromText} defaultValue={startFrom===''?startFromDefaultText:startFrom} />
        <OptionalTextLine show={removeBullets} onFocusHandler={endAtOnFocusHandler} onBlurHandler={endAtOnBlurHandler} labelText={endAtText} defaultValue={endAt===''?endAtDefaultText:endAt} /> 
        <OptionalTextLine show={removeBullets} onFocusHandler={keepOnFocusHandler} onBlurHandler={keepOnBlurHandler} labelText={keepText} defaultValue={keep===''?keepDefaultText:keep} /> 
        {removeBullets?<div className="example-sentence-indented">{removeBulletsHint}</div>:''}
      </div>
    </div>
  );

}

function OptionalTextLine(props){
  let show=props.show;
  let onFocusHandler=props.onFocusHandler;
  let onBlurHandler=props.onBlurHandler;
  let labelText=props.labelText;
  let defaultValue=props.defaultValue;

  return (
    <Fragment>
      {show?
        <div>
          <div className="search-replace-line"><span className="indent-span"></span></div>
          <div className="search-replace-line">
            <span className="search-replace-label">{labelText}</span>
          </div>
          <div className="search-replace-line">
            <input type="text" 
              className='keyword' 
              defaultValue={defaultValue}
              onBlur={(e)=>{ onBlurHandler(e);}} 
              onFocus={(e) =>onFocusHandler(e)}
            />
        </div>
        </div>      
      : 
        ''
      }
    </Fragment>
  );
}

function SearchAndReplaceSection( props){

  let searchReplaceOnChangeHandler=props.searchReplaceOnChangeHandler;

  let searchOnFocusHandler=props.searchOnFocusHandler;
  let searchOnBlurHandler=props.searchOnBlurHandler;
  let replaceOnFocusHandler=props.replaceOnFocusHandler;
  let replaceOnBlurHandler=props.replaceOnBlurHandler;

  let search = props.search;
  let replace = props.replace;
  let searchReplace = props.searchReplace;

  return (

    <div>
      <div className='facet-group-option' >
        <div className="keyword-styling-line">
            <input type='checkbox' id='searchReplaceCheckbox' onChange={(e)=>searchReplaceOnChangeHandler(e)}/>
        </div>
        <div className="keyword-styling-line">
          <span className="remove-bullets-styling-label">Find and Replace</span>
        </div>
      </div>
      <div>
        <OptionalTextLine show={searchReplace} onFocusHandler={searchOnFocusHandler} onBlurHandler={searchOnBlurHandler} labelText='Find what:' defaultValue={search}/>
        <OptionalTextLine show={searchReplace} onFocusHandler={replaceOnFocusHandler} onBlurHandler={replaceOnBlurHandler} labelText='Replace with:' defaultValue={replace}/> 
        {searchReplace?<div className="example-sentence-indented">{findReplaceHint}</div>:''}
      </div>
    </div>
  )

}

function KeywordStyleLine( props){

  let changeHandler=props.changeHandler;
  let approachHandler= props.approachHandler;
  let keywordStyling=props.keywordStyling;
  let checkboxId = keywordStyling+'Checkbox';
  let styleKeywords= props.styleKeywords;
  let approach=props.approach;
  let checked= props.checked;
  
  return (
    <Fragment>
    { styleKeywords?

    <div className='facet-group-option' >
      <div className="keyword-styling-line"><span className="indent-span"></span></div>
      <div className="keyword-styling-line">
          <input type='checkbox' id={checkboxId} onChange={(e)=>changeHandler(e)} checked={checked}/>
      </div>
      <div className="keyword-styling-line">
        <span className="keyword-styling-label">{keywordStyling}</span>
      </div>

      <div className="keyword-styling-line">
          <Approach approachHandler={approachHandler} keywordStyling={keywordStyling} approach={approach}/>
      </div>
    </div>

    :''}
    </Fragment>
  )
}

function HighlightKeywordStyleLine( props){

  let changeHandler=props.changeHandler;
  let approachHandler= props.approachHandler;
  let keywordStyling=props.keywordStyling;
  let checkboxId = keywordStyling+'Checkbox';
  let highlight = props.highlight;
  let highlightColorChangeHandler=props.highlightColorChangeHandler;
  let highlightColor=props.highlightColor;
  let highlightColorLabel=props.highlightColorLabel;
  let styleKeywords= props.styleKeywords;
  let approach=props.approach;

  return (

    <Fragment>
    { styleKeywords?

    <div className='facet-group-option'>
      <div className="keyword-styling-line"><span className="indent-span"></span></div>
      <div className="keyword-styling-line">  
          <input type='checkbox' id={checkboxId} onChange={(e)=>changeHandler(e)} checked={highlight}/>
      </div>
      <div className="keyword-styling-line">
        <span className="keyword-styling-label">{keywordStyling}</span>
      </div>
      <div className="keyword-styling-line">
          <Approach approachHandler={approachHandler} keywordStyling={keywordStyling} approach={approach}/>
      </div>
      <div className="keyword-styling-line">
          {highlight===true? 
            <HighlightColorSelect 
              className='highlightColor' 
              highlightColorChangeHandler={highlightColorChangeHandler}
              highlightColor={highlightColor}
              highlightColorLabel={highlightColorLabel}  
            />
            :
            ''}
      </div>      
    </div>

    :''}
    </Fragment>
  )
}



function KeywordStyleSection( props){

  let changeHandler=props.changeHandler;
  let approachHandler= props.approachHandler;
  let highlight = props.highlight;
  let highlightColorChangeHandler=props.highlightColorChangeHandler;
  let highlightColor=props.highlightColor;
  let highlightColorLabel=props.highlightColorLabel;
  let styleKeywordsChangeHandler= props.styleKeywordsChangeHandler;
  let styleKeywords=props.styleKeywords;
  let italicizeApproach=props.italicizeApproach;
  let boldfaceApproach=props.boldfaceApproach;
  let underlineApproach=props.underlineApproach;
  let highlightApproach=props.highlightApproach;
  let italicize=props.italicize;
  let underline=props.underline;
  let boldface=props.boldface;

  return (
    <Fragment>

      <div className='facet-group-option' >
        <div className="keyword-styling-line">
            <input type='checkbox' id='styleKeywordsCheckbox' onChange={(e)=>styleKeywordsChangeHandler(e)} checked={styleKeywords}/>
        </div>
        <div className="keyword-styling-line">
          <span className="remove-bullets-styling-label">Style Keywords</span>
        </div>
      </div>
  
      <KeywordStyleLine 
          styleKeywords={styleKeywords}
          changeHandler={changeHandler} 
          approachHandler={approachHandler}  
          keywordStyling={italicizeText}
          approach={italicizeApproach}
          checked={italicize} />  
      <KeywordStyleLine 
          styleKeywords={styleKeywords}
          changeHandler={changeHandler}
          approachHandler={approachHandler} 
          keywordStyling={underlineText} 
          approach={underlineApproach}
          checked={underline}/>
        <KeywordStyleLine 
          styleKeywords={styleKeywords}
          changeHandler={changeHandler} 
          approachHandler={approachHandler}  
          keywordStyling={boldfaceText} 
          approach={boldfaceApproach}
          checked={boldface}/>  
        <HighlightKeywordStyleLine 
          styleKeywords={styleKeywords}
          changeHandler={changeHandler} 
          approachHandler={approachHandler}  
          keywordStyling={highlightText} 
          highlight={highlight}
          highlightColorChangeHandler={highlightColorChangeHandler}
          highlightColor={highlightColor}
          highlightColorLabel={highlightColorLabel}
          approach={highlightApproach}
        />
 
    </Fragment>
  )
}

function Approach( props)
{
  let approachHandler=props.approachHandler;
  let keywordStyling=props.keywordStyling;
  let keywordStylingId = String(keywordStyling).concat('Approach');
  let approach=props.approach;

  return (
    <select 
      className="facet-group-option"
      onChange={(e)=>approachHandler(e)} 
      id={keywordStylingId} 
      value={approach}
    >
      <option value="keyword">Keywords</option>
      <option value="sentence">Sentences with Keywords</option>
    </select>      
  )
}


function KeywordEntry (props){

  let maxLengthString='200';
  if ( props.maxLength){
    maxLengthString=String(props.maxLength);
  }

  let keywordsOnBlurHandler=props.keywordsOnBlurHandler;
  let keywordsOnFocusHandler = props.keywordsOnFocusHandler;

  return(
    <div>
      <div className="search-replace-line">
        <span className="search-replace-label">Keywords</span>
      </div>
      <div className="search-replace-line">
        <input type="text" 
          className='keyword' 
          maxLength={maxLengthString} 
          defaultValue={keywordsDefaultText} 
          onBlur={(e)=>{keywordsOnBlurHandler(e);
          }} 
          onFocus={(e) =>keywordsOnFocusHandler(e)}/>
      </div>
    </div>
  )
}


ReactDOM.render(
  <ResumeTailorForm />,
  document.getElementById('root')
);





