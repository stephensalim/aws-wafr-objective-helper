// ==UserScript==
// @name         Amazon Web Services Well-Architected Framework Review Helper - FollowUp Module
// @namespace    http://console.aws.amazon.com/wellarchitected/
// @version      0.3.0
// @description  Change the codebase for followup-helper. Do not access oh_div_helper any more, which will violate the context scope in FireFox. Change to return div and handled the frontend merge in Review Helper.
// @author       ssslim@amazon.com (github:stephensalim)
// @match        https://*.console.aws.amazon.com/wellarchitected/*
// @include      https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/main/
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// ==/UserScript==


/***************************************/
/*FOLLOW UP*/

var LOG_LEVEL = '';

var OH_FOLLOWUP_APIGW = '';

/***************************************/
/* CAUTION, HIGH VOLTAGE, DO NOT TOUCH */
var OH_R_CONTAINER_DIV_READY = false;
// common register flag for checking container div ready, and any new separated module will have append the frontend DOM into this div 'oh_div_helper_container'
/***************************************/


/***************************************/
/*followup*/

var oh_followup_display_container = document.createElement('div'); //Div Container
    oh_followup_display_container.id = 'oh_followup_display_container';
    oh_followup_display_container.style.display = 'none';
    oh_followup_display_container.innerHTML = '';


var oh_check_button = document.createElement('button');
    oh_check_button.id = 'oh_check_button';
    oh_check_button.className = "awsui-button awsui-button-variant-primary";
    oh_check_button.innerHTML = 'List';
    oh_check_button.addEventListener("click", function() {
        OH_FollowUp_Get_Noncompliant();
        oh_check_button.style.display = 'none';
    });

    oh_followup_display_container.appendChild(document.createElement('hr'));
    oh_followup_display_container.appendChild(oh_check_button);

var oh_followup_div_helper_header = document.createElement('button');
    oh_followup_div_helper_header.className = "awsui-button awsui-button-variant-primary";
    oh_followup_div_helper_header.id = 'oh_followup_div_helper_header';
    oh_followup_div_helper_header.innerHTML = 'Follow-up ▼';
    oh_followup_div_helper_header.addEventListener("click", function() {
        div_ani_click_toggle('oh_followup_div_helper_header','oh_followup_display_container', 'Follow-up ');
    });


var oh_followup_div_helper = document.createElement('div');
    oh_followup_div_helper.className = 'awsui-util-container-header';
    //oh_followup_div_helper.appendChild(oh_check_button);
    oh_followup_div_helper.appendChild(oh_followup_div_helper_header);
    oh_followup_div_helper.appendChild(oh_followup_display_container);



/***************************************/
/* Mandatory function : OH_<Help-Module-Name>_Append_Div()

function OH_<Help-Module-Name>_Append_Div(){
    //Steps before the main helper Div will apend module div as ChildNode
    //here is the only chance you will call the variable oh_div_helper, append your local DOM Element into parent Div.
}
*/
function OH_FollowUp_Helper_Append_Div(){
    return oh_followup_div_helper;
}


function OH_FollowUp_Get_Noncompliant()
{
    var QuestionRef = OH_Get_Question_Ref();
    var data = JSON.stringify({"questionRef":QuestionRef});
    var url = OH_FOLLOWUP_APIGW;
    var content = document.getElementById("oh_followup_display_container");
    var GM_payload = {
        method: 'POST',
        url: url,
        data: data,
        headers: {"Content-Type":"application/json"},
        onload: function(response) {
            try{
                console.log(url, data,response.responseText);
                var res = JSON.parse(response.responseText);
                OH_FollowUp_Helper_Append_Content(res);
            }
            catch(err)
            {
                console.log(err.message, response.responseText);

            }

        },
        onerror: function (response) {
            // body...
            console.log("on error", response.responseText);
        }
    };
    GM.xmlHttpRequest(GM_payload);
}

function OH_FollowUp_Helper_Append_Content(res)
{
    var item = "Findings";
    if(res.hasOwnProperty(item)){
        let JSON_value = res[item];
        if(typeof(JSON_value) == 'object' && Array.isArray(JSON_value))
        {
            if(JSON_value.length > 0)
            {
                let findings_key = ["Name","Description","Type"];
                for(var i=0; i< JSON_value.length; i++)
                {
                    let div = document.createElement('div');
                    let finding_text = '';
                    if(typeof(JSON_value[i]) == 'object')
                    {
                        for (const [key, value] of Object.entries(JSON_value[i]))
                        {
                            if(findings_key.includes(key))
                                finding_text += key +" : "+value +"<br />";
                        }
                    }
                    div.innerHTML = div_format_key_value_to_text(" ",finding_text);
                    oh_followup_display_container.appendChild(div);
                }
            }
            else
            {
                let div = document.createElement('div');
                div.innerHTML = '<p>No record</p>';
                oh_followup_display_container.appendChild(div);
            }
        }
    }
}

/*
Mandatory function OH_<Help-Module-Name>_reload()
function OH_Context_Helper_reload() {
*/
function OH_FollowUp_Helper_reload()
{
    div_reset_innerHTML('oh_followup_display_container');
    div_ani_click_collapse('oh_followup_div_helper_header','oh_followup_display_container','followup ');
    oh_followup_display_container.appendChild(document.createElement('hr'));
    oh_followup_display_container.appendChild(oh_check_button);
    oh_check_button.style.display = 'block';

    console.log("followup Helper reload Here");
}

/*
Mandatory function OH_<Help-Module-Name>_init()
function OH_Context_Helper_init() {
    // Main entry point for the scripts
    // All the step which need to load once at initial time.
*/

function OH_FollowUp_Helper_init() {
    /* Main entry point for the scripts */
    console.log("followup Helper Init Here");
}