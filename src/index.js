import parse from 'html-react-parser';
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import { Fragment } from 'react/cjs/react.production.min';
import './index.css';
import axios from 'axios';
import fileDownload from 'js-file-download'
import Chart from 'react-google-charts'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
import moment from "moment";


const InfoPopup = (props) => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const tooltip = props.tooltip;
  return (
    <div className="tooltipDiv">

      <svg onClick={() => setOpen(o => !o)}
            width="14" height="16" viewBox="0 0 14 16">
        <path fillRule="evenodd" d="M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z">
        </path>
      </svg>

      <Popup open={open} closeOnDocumentClick onClose={closeModal} arrow="true" position="right center">
        <div className="modal">
          <a className="close" onClick={closeModal}>
            &times;
          </a>
          <span className="tooltipSentence">{parse(tooltip)}</span>
        </div>
      </Popup>
    </div>
  );
};


const keywordsDefaultText='Keywords separated by commas';
const startFromDefaultText='Optional word or phrase';
const endAtDefaultText='Optional word or phrase';
const keepDefaultText='Optional words or phrases separated by commas';
const underlineText='Underline';
const italicizeText='Italicize';
const highlightText='Highlight';
const boldfaceText='Boldface';
const keepText="Keep:";
const startFromText='Start from:';
const endAtText='End at:';
const replaceDefaultText='';
const searchDefaultText='';
const removeBulletsTooltip="<b>Remove Bullets without Keywords Explanation</b>: This removes bullet paragraphs without keyword matches. 'Start From' defines the word or phrase where bullet removal begins in the Word document. 'End at' defines the word or phrase where bullet removal ends. 'Keep' words keeps bullets even though they have no matching keywords.";
const findReplaceTooltip="<b>Find and Replace Hint</b>: You might replace the words <i>'Resume Title'</i> with the Job Title you are applying for.";
const selectResumeTooltip='<b>Select a Resume Details</b>: Select a resume in MS Word *.docx format.';
const wordFileType='application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const keywordStylingTooltip="<b>Style Keywords Hint</b>: Select the <i>Italics</i>, <i>Boldface</i>, <i>Highlight</i>, <i>Underline</i> checkboxes to see the effect on the Example Sentence. "
+"Also try out the <i>Keywords</i> and <i>Sentences with Keywords</i> drop down values.  "
+"The chosen combination of styling effects seen in the Example Sentence are applied to the generated Word document.";
const removeBracketsTooltip="<p><b>Remove Brackets Explanation</b>:<br/>'Removing Brackets' results in the following:"
+"<ul>"
+"<li>Before: Filled in as the Team's Database administrator [#Oracle,#DBA,#keepme,#leadership].</li>"
+"<li>After: Filled in as the Team's Database administrator.</li>"
+"</ul>"
+"This enables you to hide the keywords you are focused on by placing them in brackets. "
+"Imagine a resume with 20 bullets. And you want to only keep the six bullets with '#leadership' in brackets. "
+"Selecting both 'Remove Bullets without keywords' and 'Remove Brackets', then adding '#leadership' as a keyword enables this. "+
"And if you always want to show a bulleted paragraph, then adding a 'Keep' marker like '#keepme' makes it happen. </p>"
+"<p>This feature ultimately can transform a big generic resume into a smaller resume focused on a job requirement. </p>";



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
      keywords:null,
      keywordArray:[],
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
      outputFilename: null,
      stats: null,
      unmatchedKeywords: [],
      percentageMatch:null,
      loaderVisible:false,
      generationComplete: false
    };

    
  }

  handleDownload = (url, filename) => {
    axios.get(url, {
      responseType: 'blob',
    })
    .then((res) => {
      fileDownload(res.data, filename)
    })
  }


  onFileChange = e =>{

      if ( e.target!==undefined && e.target!==null && e.target.files[0]!==null && e.target.files[0]!==undefined)
      {
        console.log("selected file target: " + e.target.files[0].name);
        this.setState({ selectedFile: e.target.files[0]});
      }
      else{
        console.log("selected file : null");
        this.setState({ selectedFile: null});
      }
     
  }

  doResumeUpload = () => { 
    
    // zero out the state before the post
    this.setState({
      uploadError: null, 
      uploadResponse: null,      
      outputFilename: null, 
      unmatchedKeywords: null,
      stats: null,
      percentageMatch: null,
      loaderVisible: true,
      generationComplete: false,
    });  
    
    
    const formData = new FormData(); 
   
    formData.append( 
      "file", 
      this.state.selectedFile, 
      this.state.selectedFile.name 
    ); 

    const mainRequestBody = this.buildMainRequestBody();
    formData.append("json", mainRequestBody);
    axios.post("resume/upload", formData, {
      /// ... headers are set automagically. You are supposed to have those undefined.
      // headers: {
      //   'Content-Type':'multipart/form-data'
      // }
    })
      .then(res => {
        this.setState({ outputFilename: res.data.outputFilename, 
                        unmatchedKeywords: res.data.unmatchedKeywords,
                        stats: res.data.stats,
                        percentageMatch: res.data.percentageMatch,
                        loaderVisible: false,
                        generationComplete: true
                      });  

      }).catch(err => {
        this.setState({uploadError: err, loaderVisible: false, generationComplete: false})
      });
  }; 

  doReset(){
    this.setState({
      generationComplete:false,
      loaderVisible: false, 
      stats: null,
      unmatchedKeywords: null,
      outputFilename: null,
      percentageMatch: null
    });
  }

  doSubmit(){
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
    this.setState({keywordArray: keywordArray});
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
    let keywordsEntered = e.target.value.trim();
    console.log("onBlur: keywords are now: " + keywordsEntered);
    if ( keywordsEntered===keywordsDefaultText)
    {
      keywordsEntered='';
    }
    if ( keywordsEntered===''){
      e.target.value=keywordsDefaultText;
    }


    this.setState({
      keywords: keywordsEntered,
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
 
  getChartDataColor( i ){
    let index = i%10;

    if ( index===0) return 'green';
    if ( index===1) return 'black';
    if ( index===2) return 'blue';
    if ( index===3) return 'orange';
    if ( index===4) return 'purple';
    if ( index===5) return 'yellow';
    if ( index===6) return 'magenta';
    if ( index===7) return 'gray';
    if ( index===8) return 'cyan';
    if ( index===9) return 'red';
  }

  

  assembleChartData(){
    const stats = this.state.stats;
    let chartData= [
      [
        'Keyword',
        'Matches Found',
        { role: 'style' },
        {
          sourceColumn: 0,
          role: 'annotation',
          type: 'string',
          calc: 'stringify',
        },
      ]
    ];

   
    if ( stats!==null){
      let i=0;

      Object.entries( stats ).map(([keyword,matches])=>{
        chartData.push([keyword,matches,this.getChartDataColor(i),null]);
        i++;
        return i;
      })

      let j=0;
      for ( j=0; j < this.state.unmatchedKeywords.length; j++){
        let keyword= this.state.unmatchedKeywords[j];
        chartData.push([keyword,0,this.getChartDataColor((i+j)),null]);
      }
     
    }

   
    if( chartData.length<2){
      return []; /// return an empty array 
    }
    return chartData;
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


        {this.state.generationComplete!==true? <SectionHeader text="Resume Tailor Setup"/>:''}

        {this.state.generationComplete!==true?
          <SelectResumeSection onFileChange={this.onFileChange.bind(this)} 
              selectedFile={this.state.selectedFile}/>
        :''}

        {this.state.generationComplete!==true?
          <KeywordEntry 
            keywords={this.state.keywords}
            keywordsOnBlurHandler={this.keywordsOnBlurHandler.bind(this)} 
            keywordsOnFocusHandler={this.keywordsOnFocusHandler.bind(this)}/>
        :''}

        {this.state.generationComplete!==true?
          <SectionHeader text="Choose Options and Generate Resume"/>
        :''}

        {this.state.generationComplete!==true?
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
        :''}

        {this.state.generationComplete!==true?
          <ExampleSentence styleKeywords={this.state.styleKeywords} getExampleSentence={this.getExampleSentence.bind(this)} />
        :''}

        {this.state.generationComplete!==true?
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
        :''}

        {this.state.generationComplete!==true?
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
        :''}

        {this.state.generationComplete!==true?
          <BracketSection bracketsChangeHandler={this.handleBracketsChange.bind(this)} />
        :''}

        {this.state.generationComplete!==true?  
          <GenerateSection loaderVisible={this.state.loaderVisible} 
            doSubmit={this.doSubmit.bind(this)} 
            generationComplete={this.state.generationComplete}/>
        :''}

        
        <ResetButton   
          doReset={this.doReset.bind(this)}
          generationComplete={this.state.generationComplete}/>  

        {this.state.generationComplete?
          <ResultsSection outputFilename={this.state.outputFilename}
                          filename={this.state.selectedFile.name}  
                          handleDownload={this.handleDownload.bind(this)}
                          percentageMatch={this.state.percentageMatch}
                          chartData={this.assembleChartData()}
                          keywordArray={this.state.keywordArray}
                          stats= {this.state.stats}
                          unmatchedKeywords={this.state.unmatchedKeywords}/>
        :''}
      </div>
    );
  }

  handleUnderlineChange(e) { this.setState({ underline: e.target.checked, }); }

  handleDeleteBulletsChange(e){ this.setState({ removeBullets: e.target.checked, }); }

  searchReplaceOnChangeHandler(e){ this.setState({ searchReplace: e.target.checked, }); }

  handleStyleKeywordsChange(e){ this.setState({ styleKeywords: e.target.checked, }); }

  handleBracketsChange(e){ this.setState({ brackets: e.target.checked }) }

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

function SectionHeader(props){
  const text= props.text;

  return (
    <Fragment>
      <div className="facet-group-header-text">{text}</div>
      <hr className="rounded"/>
    </Fragment>
  )

}

function SelectResumeSection(props){
  let onFileChange= props.onFileChange;
  let selectedFile = props.selectedFile;
  
  const hiddenFileInput = React.useRef(null);

  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  return (
    <div>
      <div className="search-replace-line">
      <span className="select-resume-label">Select a Resume</span>
      </div>
      <div className="search-replace-line">
        <input type="button" onClick={handleClick} value="Upload in .docx format" className="cust-button"/>
        <input type="file" ref={hiddenFileInput} onChange={onFileChange} className="cust-button" style={{display: 'none'}} />
      </div>
      <SelectedFile selectedFile={selectedFile}/>
      
    </div>
  )
}

function SelectedFile( props){
  let selectedFile = props.selectedFile;

  console.log("Selected File: " + selectedFile);

  return (
    <div className="search-replace-line">
      <span>&nbsp;&nbsp;{selectedFile!==null && selectedFile!==undefined? selectedFile.name:'No file selected'}</span>
    </div>
  )

}


function ExampleSentence(props){
  let styleKeywords= props.styleKeywords;
  let getExampleSentence= props.getExampleSentence;

  return(
    <Fragment>
    {styleKeywords?
      <div className="example-sentence-indented">{parse(getExampleSentence())}</div>
    :''
    } 
    </Fragment>
  )

}

function GenerateSection(props){
  let loaderVisible = props.loaderVisible;
  let doSubmit = props.doSubmit;
  let generationComplete=props.generationComplete;

  return (
    <Fragment>
      { loaderVisible? 
          <Loader
          type="ThreeDots"
          color="#00BFFF"
          height={60}
          width={60}
          timeout={300000} 
          visible={loaderVisible}
        />
      :
        <GenerateButton doSubmit={doSubmit} generationComplete={generationComplete} />        
      }

    </Fragment>

  )

}

function GenerateButton(props){
  let doSubmit = props.doSubmit;
  let generationComplete=props.generationComplete;

  return (
    <Fragment>
      { generationComplete? '' :
        <p><input type="button" onClick={doSubmit} value="Generate Tailored Resume" className="cust-button2"/></p>
      }
    </Fragment>
  )
}

function ResetButton(props){
  let doReset = props.doReset;
  let generationComplete=props.generationComplete;

  return (
    <Fragment>
      { generationComplete? 
        <p><input type="button" onClick={doReset} value="Return to Setup" className="cust-button"/></p>
      :
      ''
      }
    </Fragment>
  )
}

function ResultsHeader(props){
  return (
    <Fragment>
      <div className="facet-group-header-text">Results</div> 
      <hr className="rounded"/>
    </Fragment>
  )
}

function DetailedResultsHeader(props){
  return (
    <Fragment>
      <div className="facet-group-header-text">Detailed Results</div> 
      <hr className="rounded"/>
    </Fragment>
  )
}

function ResultsSection(props){
  let filename = props.filename;
  console.log('ResultsSection: filename ' + filename);

  let outputFilename = props.outputFilename;
  let handleDownload = props.handleDownload;
  let percentageMatch = props.percentageMatch;
  let chartData = props.chartData;
  let downloadUrl = './resume/download?filename='+outputFilename;
  let keywordArray= props.keywordArray;
  let stats = props.stats;
  let unmatchedKeywords= props.unmatchedKeywords;

  return (
    <Fragment>
      <ResultsHeader/>
      

{outputFilename!==null?
    <div>
      <button onClick={() => {handleDownload(downloadUrl, outputFilename)}} className="cust-button2">Download Tailored Resume<br/>{outputFilename}</button>
      <p>
      <KeywordMatchesChart chartData={chartData} percentageMatch={percentageMatch}/>
      </p>
    </div>
:''}
      <DetailedResultsHeader/>
      <KeywordPercentageMatch percentageMatch={percentageMatch}/>
      <KeywordResultsListing keywordArray={keywordArray}/>
      <MatchedKeywordListing stats={stats}/>
      <UnmatchedKeywordListing unmatchedKeywords={unmatchedKeywords}/>
      <OriginalDocument filename={filename}/>
      <UpdatedDocument filename={outputFilename}/>
      <ResultTimestamp/>


    </Fragment>
  )
}

function KeywordMatchesChart (props) {
  let chartData = props.chartData;
  let startGrowingThreshold=6;
  let growBy=30;
  let maxHeight=800;

  let baseHeight = 300;
  let height= chartData.length>startGrowingThreshold?(baseHeight + (chartData.length-(startGrowingThreshold))*growBy):baseHeight;
  if ( height>maxHeight){
    height=maxHeight;
  }
  let pixelHeight=''+height+'px';
  let optionsHeight= height-50;


  return (
    (chartData.length>0?

      <Chart
      width={'100%'}
      height={pixelHeight}
      chartType="BarChart"
      loader={<div>Loading Chart</div>}
      data= {chartData}
      options={{
        title: 'Keyword Search Statistics',
        height: optionsHeight,
        bar: { groupWidth: '95%' },
        legend: { position: 'none' },
      }}
      />
    :
    '')    
  );
};

function UploadErrorsSection( props){
  let uploadError= props.uploadError;

  let errors= [];

  if ( uploadError!==null ){
    let message = "Server Error occurred "; // + uploadError.response.status ;
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
    if ( keywords===null || keywords.trim()===''){
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

  return(
    <div>
      <div className='facet-group-option' >
        <div className="keyword-styling-line">
            <input type='checkbox' id='bracketsCheckbox' onChange={(e)=>bracketsChangeHandler(e)}/>
        </div>
        <div className="keyword-styling-line">
          <span className="remove-bullets-styling-label">Remove Brackets (Advanced)</span>
        </div>
        <div className="keyword-styling-line">
          <InfoPopup tooltip={removeBracketsTooltip}/>
        </div> 
      </div>
      <div className="search-replace-line"><span className="indent-span"></span></div>
    </div>

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
        <div className="keyword-styling-line">
          <InfoPopup tooltip={removeBulletsTooltip}/>
        </div>        
      </div>
      <div>
        <OptionalTextLine show={removeBullets} onFocusHandler={startFromOnFocusHandler} onBlurHandler={startFromOnBlurHandler} labelText={startFromText} defaultValue={startFrom===''?startFromDefaultText:startFrom} />
        <OptionalTextLine show={removeBullets} onFocusHandler={endAtOnFocusHandler} onBlurHandler={endAtOnBlurHandler} labelText={endAtText} defaultValue={endAt===''?endAtDefaultText:endAt} /> 
        <OptionalTextLine show={removeBullets} onFocusHandler={keepOnFocusHandler} onBlurHandler={keepOnBlurHandler} labelText={keepText} defaultValue={keep===''?keepDefaultText:keep} /> 
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
          <span className="find-replace-styling-label">Find and Replace</span>
        </div>
        <div className="keyword-styling-line">
          <InfoPopup tooltip={findReplaceTooltip}/>
        </div>
      </div>
      <div>
        <OptionalTextLine show={searchReplace} onFocusHandler={searchOnFocusHandler} onBlurHandler={searchOnBlurHandler} labelText='Find what:' defaultValue={search}/>
        <OptionalTextLine show={searchReplace} onFocusHandler={replaceOnFocusHandler} onBlurHandler={replaceOnBlurHandler} labelText='Replace with:' defaultValue={replace}/> 
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
        <div className="keyword-styling-line">
          <InfoPopup tooltip={keywordStylingTooltip}/>
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

function MatchedKeywordListing (props){

  let stats=props.stats;

  let matchListing='No matches found';
  let matchArray=[];

  if ( stats!==null){
    let i=0;

    Object.entries( stats ).map(([keyword,matches])=>{
      let s = keyword + " (" + matches + ")";
      matchArray.push(s)
      return i++;
    })
    matchListing= matchArray.join(", ");
  
  }

  return(
    <ResultDetail resultLabel="Matches Found" resultValue={matchListing}/>
  )
}

function UnmatchedKeywordListing (props){

  let unmatchedKeywords=props.unmatchedKeywords;

  let unmatchedListing='No unmatched keywords';
  
  if ( unmatchedKeywords!==null && unmatchedKeywords.length>0){
    unmatchedKeywords = unmatchedKeywords.sort(function(a,b){
      return a.localeCompare(b);
    })
    unmatchedListing= unmatchedKeywords.join(", ");
  
  }

  return(
    <ResultDetail resultLabel="Unmatched Keywords" resultValue={unmatchedListing}/>
  )
}

function ResultTimestamp (props){
  
  let timestamp = moment().format("MMM-DD-YYYY hh:mm:ss a")

  return(
    <ResultDetail resultLabel="Results Timestamp" resultValue={timestamp}/>
  )
}

function OriginalDocument (props){
  let filename = props.filename;
  return(
    <ResultDetail resultLabel="Original Doc" resultValue={filename}/>
  )
}

function UpdatedDocument (props){
  let filename = props.filename;
  return(
    <ResultDetail resultLabel="Updated Doc" resultValue={filename}/>
  )
}

function ResultDetail( props ){
  let resultLabel = props.resultLabel;
  let resultValue = props.resultValue;

  return(
    <div>
      <div className="search-replace-line">
        <span className="add-keywords-label"><b>{resultLabel}:&nbsp;</b></span>
      </div>
      <div className="search-replace-line">
        <span className="keywords-listing-label">{resultValue}</span>
      </div>
    </div>
  )

}


function KeywordPercentageMatch (props){

  let percentageMatch=props.percentageMatch;

  let percentageMatchString = "Not Applicable";

  if ( percentageMatch!==null && percentageMatch.trim()!==''){
    percentageMatchString = percentageMatch;
  }

  return(
    <ResultDetail resultLabel="Overall Match" resultValue={percentageMatchString}/>
  )
}

function KeywordResultsListing (props){

  let keywordArray=props.keywordArray;

  let keywordList = "None";

  if ( keywordArray!==null && keywordArray.length>0){
    keywordArray = keywordArray.sort(function(a,b){
      return a.localeCompare(b);
    })
    keywordList= keywordArray.join(", ");
  }

  return(
    <ResultDetail resultLabel="Keywords Sought" resultValue={keywordList}/>
  )
}


function KeywordEntry (props){

  let keywordsOnBlurHandler=props.keywordsOnBlurHandler;
  let keywordsOnFocusHandler = props.keywordsOnFocusHandler;
  let keywords= props.keywords;

  let maxLengthString='200';
  if ( props.maxLength){
    maxLengthString=String(props.maxLength);
  }

  return(
    <div>
      <div className="search-replace-line">
        <span className="add-keywords-label">Add Keywords</span>
      </div>
      <div className="search-replace-line">
        <input type="text" 
          className='keyword' 
          maxLength={maxLengthString} 
          defaultValue={keywords===null || keywords.trim()===''? keywordsDefaultText:keywords} 
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





