<?php

require APPPATH . 'libraries/REST_Controller.php';
header('Access-Control-Allow-Origin: *');
//header("Cache-Control: no-cache,no-store, must-revalidate,pre-check=0,max-age=0,s-maxage=0");
//header("Pragma: no-cache"); //HTTP 1.0
//header("Expires: 0");

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

use Spipu\Html2Pdf\Html2Pdf;
     
class CreatePdf extends CI_Controller {
    
     
    public function __construct() {
       parent::__construct();
       $this->load->database();
       $this->load->model('PdfModel');
       // $this->load->library("pdf");
//       $this->load->library("PDF_HTML");
//       $this->load->library("Mpdf");

//       $this->load->library("Html2pdf_lib");
    }

    public function createSpreadsheet(){

        $user_id=$this->input->get('user_id');

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setCellValue('A1',  'Q1');
        $sheet->setCellValue('B1',  'Q2');
        $sheet->setCellValue('C1',  'Q3');
        $sheet->setCellValue('D1',  'Q4');
        $sheet->setCellValue('E1',  'Q5');
        $sheet->setCellValue('F1',  'Q6');
        $sheet->setCellValue('G1',  'Q7');
        $sheet->setCellValue('H1',  'Q8');
        $sheet->setCellValue('I1',  'Q9');
        $sheet->setCellValue('J1',  'Q10');
        $sheet->setCellValue('K1',  'Q11');
        $sheet->setCellValue('L1',  'Q12');
        $sheet->setCellValue('M1',  'Q13');
        $sheet->setCellValue('N1',  'Q14');
        $sheet->setCellValue('O1',  'Q15');
        $sheet->setCellValue('P1',  'Q16');
        $sheet->setCellValue('Q1',  'Q17');
        $sheet->setCellValue('R1',  'Q18');
        $sheet->setCellValue('S1',  'Q19');
        $sheet->setCellValue('T1',  'Q20');
        $sheet->setCellValue('U1',  'Q21');
        $sheet->setCellValue('V1',  'Q22');
        $sheet->setCellValue('W1',  'Q23');
        $sheet->setCellValue('X1',  'Q24');
        $sheet->setCellValue('Y1',  'Q25');
        $sheet->setCellValue('Z1',  'Q26');
        
        $writer = new Xlsx($spreadsheet);
 
        $filename = 'checking_pdf';

        $userData=$this->PdfModel->getUser($user_id);
        $businessData=$this->PdfModel->getBusinessByUserID($user_id);
        $employeeData=$this->PdfModel->getEmployerByUserID($user_id);
        $hofData=$this->PdfModel->getHOFByUserID($user_id);


        
        
 
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="'. $filename .'.xlsx"'); 
        header('Cache-Control: max-age=0');
        
        $writer->save('php://output');
    }


    public function parseRequest($data){

        $password="AVIVASME#2020";

        $request=$data['request'];
        $data=explode("%A%T",$request);
        $encString=$data[0];
        $iv=$data[1];
        $s=$data[2];

        $dec_arr=array('ct'=>$encString,'s'=>$s,'iv'=>$iv);


        return $this->cryptoJsAesDecrypt($password,json_encode($dec_arr));

    }


    public function parsePdfRequest($request){

        $password="AVIVASME#2020";

        $data=explode("%A%T",$request);
        $encString=$data[0];
        $iv=$data[1];
        $s=$data[2];

        $dec_arr=array('ct'=>$encString,'s'=>$s,'iv'=>$iv);


        return $this->cryptoJsAesDecrypt($password,json_encode($dec_arr));

    }

    public function encryptResponse($str){
        $password="AVIVASME#2020";
        $encryption=$this->cryptoJsAesEncrypt($password,$str);
        // echo "<br>encrypted string:-".$encryption;
        $encryptionArr=json_decode($encryption,true);
        $responseString=$encryptionArr['ct']."%A%T".$encryptionArr['iv']."%A%T".$encryptionArr['s'];
        return $responseString;
    }

    function cryptoJsAesDecrypt($passphrase, $jsonString){

        // echo "jsonString:-".$jsonString;

        $jsondata = json_decode($jsonString, true);
        $salt = hex2bin($jsondata["s"]);
        $ct = base64_decode($jsondata["ct"]);
        $iv  = hex2bin($jsondata["iv"]);
        $concatedPassphrase = $passphrase.$salt;
        $md5 = array();
        $md5[0] = md5($concatedPassphrase, true);
        $result = $md5[0];
        for ($i = 1; $i < 3; $i++) {
            $md5[$i] = md5($md5[$i - 1].$concatedPassphrase, true);
            $result .= $md5[$i];
        }
        $key = substr($result, 0, 32);
        $data = openssl_decrypt($ct, 'aes-256-cbc', $key, true, $iv);
        return json_decode($data, true);
    }

    /**
    * Encrypt value to a cryptojs compatiable json encoding string
    *
    * @param mixed $passphrase
    * @param mixed $value
    * @return string
    */
    function cryptoJsAesEncrypt($passphrase, $value){
        $salt = openssl_random_pseudo_bytes(8);
        $salted = '';
        $dx = '';
        while (strlen($salted) < 48) {
            $dx = md5($dx.$passphrase.$salt, true);
            $salted .= $dx;
        }
        $key = substr($salted, 0, 32);
        $iv  = substr($salted, 32,16);
        $encrypted_data = openssl_encrypt(json_encode($value), 'aes-256-cbc', $key, true, $iv);
        $data = array("ct" => base64_encode($encrypted_data), "iv" => bin2hex($iv), "s" => bin2hex($salt));
        return json_encode($data);
    }

    public function createPDF()
    {
        $user_id = $this->input->get('user_id');
//		echo "`User_id:-".$this->input->get('user_id');
//		$user_id=$this->parsePdfRequest($this->input->get('user_id'));
//		echo "parsedUser_id:-".$user_id;
        // echo "user_id:-".$user_id;

        $userData = $this->PdfModel->getUser($user_id);
        // echo "userdata:-".json_encode($userData);
        $businessData = $this->PdfModel->getBusinessByUserID($user_id);
        $employeeData = $this->PdfModel->getEmployerByUserID($user_id);
        $hofData = $this->PdfModel->getHOFByUserID($user_id);

        // echo "user_data:-".$userData->name;

        if ($userData && $businessData && $employeeData && $hofData) {

            $salutation = $userData->salutation;
            $name = $userData->name ? $userData->name : null;


            $clientName = $salutation . ' ' . $name;
            $clientName_long = $clientName;
            if (strlen($clientName) > 12) {
                $clientName_long = '<br>' . $clientName;
            }
            // echo "\n client long name:-".$clientName_long;
            $Rname = $name;
            $clientDob = $userData->salutation ? $userData->salutation : null;
            $clientMobile = $userData->mobile ? $userData->mobile : null;
            $clientEmail = $userData->email_id ? $userData->email_id : null;
            $clientCompany = $userData->company_name ? $userData->company_name : null;
            $clientLocation = $userData->city ? $userData->city : null;
            $cagentId = $userData->aviva_emp_id ? $userData->aviva_emp_id : null;
            $nameTitle = $salutation;

            //Age Differnce
            $date = date('Y');
            $YearClient = date('Y', strtotime($clientDob));
            $AgeDiff = ($date - $YearClient);

            $maxAge = $this->PdfModel->getHighestAge()->age;

            $PremiumData = $this->PdfModel->getPremiumData($AgeDiff);

            $PremiMale = $PremiumData->male;
            $PremiFemale = $PremiumData->female;
            if ($nameTitle != 'Mr.') {
                $PremiumRate = $PremiFemale;
            } else {
                $PremiumRate = $PremiMale;
            }


            //echo '<pre>';
            //print_r($data);exit;

            //2nd Step
            $AnswerNatureBusi = $businessData->q1 ? $businessData->q1 : null;

            if(strtolower($AnswerNatureBusi)=='proprietor'){
                $AnswerNatureBusi='Proprietor';
            }else if(strtolower($AnswerNatureBusi)=='partnership'){
                $AnswerNatureBusi='partnership';
            }else if(strtolower($AnswerNatureBusi)=='pvt ltd. company'){
                $AnswerNatureBusi='Pvt';
            }

            // echo "<br>$AnswerNatureBusi:-".$AnswerNatureBusi;


            $PARcompanyTurnOver = "boq2lac" ? "boq2lac" : null;
            $AnsPARannualturnover = $businessData->q2 ? $businessData->q2 : 0;
            $question2 = $PARcompanyTurnOver . ':' . $AnsPARannualturnover;    //       turn over in lacs
            //33rd step

            $PROcompanyTurnOver = "boq2cr" ? "boq3cr" : null;
            $AnsPROannualturnover = $businessData->q2 ? $businessData->q2 : 0;
            $question3 = $PROcompanyTurnOver . ':' . $AnsPROannualturnover;    //       turn over in crores

            //4th Step
            $PARtotalAssets = "boq3lac" ? "boq3lac" : null;
            $AnsassetstotalvaluePAR = $businessData->q3 ? $businessData->q3 : 0;
            $question4 = $PARtotalAssets . ':' . $AnsassetstotalvaluePAR;      //     assets in lacs
            //44th Step

            $PROtotalAssets = "boq3cr" ? "boq3cr" : null;
            $AnsassetstotalvaluePRO = $businessData->q3 ? $businessData->q3 : 0;
            $question5 = $PROtotalAssets . ':' . $AnsassetstotalvaluePRO;      //     assets in crores
            //5th STEP

            $partnerwiseshareholding = "boq1a";

            if ($businessData->q1a == '') {
                $partner1 = null;
                $partner2 = null;
                $partner3 = null;
                $partner4 = null;
                $partner5 = null;
            } else {
                $q1aans = explode(",", $businessData->q1a);
                if (count($q1aans) == 5) {
                    $partner1 = $q1aans[0];
                    $partner2 = $q1aans[1];
                    $partner3 = $q1aans[2];
                    $partner4 = $q1aans[3];
                    $partner5 = $q1aans[4];
                } else if (count($q1aans) == 4) {
                    $partner1 = $q1aans[0];
                    $partner2 = $q1aans[1];
                    $partner3 = $q1aans[2];
                    $partner4 = $q1aans[3];
                    $partner5 = null;
                } else if (count($q1aans) == 3) {
                    $partner1 = $q1aans[0];
                    $partner2 = $q1aans[1];
                    $partner3 = $q1aans[2];
                    $partner4 = null;
                    $partner5 = null;
                } else if (count($q1aans) == 2) {
                    $partner1 = $q1aans[0];
                    $partner2 = $q1aans[1];
                    $partner3 = null;
                    $partner4 = null;
                    $partner5 = null;
                } else if (count($q1aans) == 1) {
                    $partner1 = $q1aans[0];
                    $partner2 = null;
                    $partner3 = null;
                    $partner4 = null;
                    $partner5 = null;
                } else if (count($q1aans) == 0) {
                    $partner1 = null;
                    $partner2 = null;
                    $partner3 = null;
                    $partner4 = null;
                    $partner5 = null;
                }
            }


            $question6 = "boq1a" . ':' . $partner1 . ':' . $partner2 . ':' . $partner3 . ':' . $partner4 . ':' . $partner5;
            setlocale(LC_MONETARY, 'en_IN');

            // $partnerAAssets = 0;
            // $partnerBAssets = 0;
            // $partnerCAssets = 0;
            // $partnerDAssets = 0;
            // $partnerEAssets = 0;

            if ($AnsassetstotalvaluePAR > 0) {
                $partnerAAssets = ($AnsassetstotalvaluePAR * $partner1 / 100);
                $partnerBAssets = ($AnsassetstotalvaluePAR * $partner2 / 100);
                $partnerCAssets = ($AnsassetstotalvaluePAR * $partner3 / 100);
                $partnerDAssets = ($AnsassetstotalvaluePAR * $partner4 / 100);
                $partnerEAssets = ($AnsassetstotalvaluePAR * $partner5 / 100);
            }

            if ($partnerAAssets >= 1) {
                $final1partinsval = $partnerAAssets . ' Crore';
            } else {
                $final1partinsval = $partnerAAssets * 100 . '  Lac';
            }

            if ($partnerEAssets >= 1) {
                $final5partinsval = $partnerEAssets . ' Crore';
            } else {
                $final5partinsval = $partnerEAssets * 100 . '  Lac';
            }

            if ($partnerBAssets >= 1) {
                $final2partinsval = $partnerBAssets . ' Crore';
            } else {
                $final2partinsval = $partnerBAssets * 100 . '  Lac';
            }

            if ($partnerCAssets >= 1) {
                $final3partinsval = $partnerCAssets . ' Crore';
            } else {
                $final3partinsval = $partnerCAssets * 100 . '  Lac';
            }

            if ($partnerDAssets >= 1) {
                $final4partinsval = $partnerDAssets . ' Crore';
            } else {
                $final4partinsval = $partnerDAssets * 100 . '  Lac';
            }



            //7th STEP
            // $businessexpansion = isset($data['q7']) ? $data['q7'] : null;
            // $bexpansion = isset($data['pbe']) ? $data['pbe'] : null;
            // $question7 = $businessexpansion.':'.$bexpansion;
            //8th Step
            // $takingloan = isset($data['q8']) ? $data['q8'] : null;
            // $loanTake = isset($data['taken_loan']) ? $data['taken_loan'] : null;
            // $question8 = $takingloan.':'.$loanTake;

            $loanTake = $businessData->q5 ? $businessData->q5 : null;

            //9th Step
            $CurrentUnsecureOut = "boq5a";
            $AnswerCurrentOut = $businessData->q5a ? $businessData->q5a : null;
            $question9 = $CurrentUnsecureOut . ':' . $AnswerCurrentOut;


            $AnswerRollemp = $employeeData->q1 ? $employeeData->q1 : null;
            if($AnswerRollemp=='Less than 10'){
                $AnswerRollemp='10';
            }else if($AnswerRollemp=='Between 10-20'){
                $AnswerRollemp='10-20';
            }else if($AnswerRollemp=='More than 20'){
                $AnswerRollemp='20';
            }


            $AnswerkeyPeople = $employeeData->q2 ? $employeeData->q2 : 0;


            $AnswerEmployee = $employeeData->q3 ? $employeeData->q3 : null;

            $empq4 = $employeeData->q4;
            if ($empq4 == "None") {
                $AnswerbusinessIncKM = null;
                $AnswerbusinessIncPI = null;
                $AnswerbusinessIncEEP = null;
            } else {
                $AnswerbusinessIncKM = null;
                $AnswerbusinessIncPI = null;
                $AnswerbusinessIncEEP = null;

                $empq4_arr = explode(",", $employeeData->q4);
                //print_r($empq4_arr);
                for ($i = 0; $i < count($empq4_arr); $i++) {
                    if ($empq4_arr[$i] == "Key Man Insurance") {
                        $AnswerbusinessIncKM = "Key Man";
                    } else if ($empq4_arr[$i] == "Partnership Insurance") {
                        $AnswerbusinessIncPI = "Partnership Insurance";
                    } else if ($empq4_arr[$i] == "Employer Employee Policy") {
                        $AnswerbusinessIncEEP = "Employer Employee Policy";
                    }
                }
            }

//            echo "AnswerbusinessIncKM:-".$AnswerbusinessIncKM;


            $AnswerGratuityEmp = $employeeData->q5 ? $employeeData->q5 : null;
            if($AnswerGratuityEmp=="I manage my employees' gratuity myself"){
                $AnswerGratuityEmp="I manage gratuity";
            }


            $AnswerEmpPF = $employeeData->q6 ? $employeeData->q6 : null;
            if($AnswerEmpPF=="I have opted for an EDLI policy from an insurer"){
                $AnswerEmpPF="My employees have EDLI policy";
            }


            $AnswerFam = $hofData->q1 ? $hofData->q1 : null;

            $AnswerLifeInsC = $hofData->q2 ? $hofData->q2 : null;

            $AnswerInsurn = $hofData->q3 ? $hofData->q3 : null;

            $AnswerAnn = $hofData->q4 ? $hofData->q4 : null;

            $AnswerVar = $hofData->q5 ? $hofData->q5 : null;

            $AnswerManageFam = $hofData->q6 ? $hofData->q6 : null;

            $AnswerSpecificIn = $hofData->q7 ? $hofData->q7 : null;

            $AnswerHousehold = $hofData->q8 ? $hofData->q8 : null;

            if ($AnswerHousehold == "I am adequately insured") {
                $AnswerHousehold = "I am adequately insured; the family will not have significant financial issues";
            }

            $AnswerQuality = $hofData->q9 ? $hofData->q9 : null;

            $AnswerRetiremnt = $hofData->q10 ? $hofData->q10 : null;
            if($AnswerRetiremnt=='I will continue to work'){
                $AnswerRetiremnt='Have not planned';
            }


            $date = date('Y-m-d H:i:s');
            $ip = getenv('HTTP_CLIENT_IP') ?:
                getenv('HTTP_X_FORWARDED_FOR') ?:
                    getenv('HTTP_X_FORWARDED') ?: getenv('HTTP_FORWARDED_FOR') ?: getenv('HTTP_FORWARDED') ?: getenv('REMOTE_ADDR');
            $cid = rand() . $clientMobile;

            if ($AnsPARannualturnover != 0) {
                $keyFAssest = $AnsPARannualturnover;
            }
            if ($AnsPROannualturnover != 0) {
                $keyFAssest = $AnsPROannualturnover;
            }

            @$menAssets = round(($keyFAssest / 2) / $AnswerkeyPeople, 2);

            if ($menAssets < 1) {
                $AsetVal = 'Rs.' . $this->money_format('%!.0n', $menAssets * 100000);
            } else {
                $AsetVal = 'Rs.' . $menAssets . ' Lacs';
            }

            $totalsaving = $AnswerLifeInsC * 100000;
            $annualIncomes = (int)$AnswerAnn * 100000 * 20 - (int)$totalsaving;


            $rebatepremiumon25 = (2500000 * ($PremiumRate / 1000));
            $PremiumValue = $annualIncomes * ($PremiumRate / 1000);
            if (10000000 <= $annualIncomes && $annualIncomes < 50000000) {
                $rebatepremium = round($PremiumValue - ($PremiumValue * 2 / 100));
            } elseif ($annualIncomes >= 50000000) {
                $rebatepremium = round($PremiumValue - ($PremiumValue * 3.5 / 100));
            } else {
                $rebatepremium = $PremiumValue;
            }


            if ($AnswerCurrentOut > 1) {
                $LoanOutValue = $AnswerCurrentOut . ' Lacs';
            } else {
                $LoanOutValue = $this->money_format('%!.0n', $AnswerCurrentOut * 100000);
            }

            // echo "\n$AnswerHousehold:-".$AnswerHousehold;

            $content = '';

            $basePath = 'https://www.avivaindia.com/sme-assist/sme/angular_pdf/';
            try {
                ob_start();
                $content .= '<style type="text/css">.nobreak{page-break-inside: avoid;}td{font-size:14px;line-height:24px;font-family:helvetica;}p{font-size:14px;line-height:24px;font-family:helvetica;} .recp{margin-bottom:0; padding-bottom:0;line-height:0;}.gtext{font-family:avivabold; font-weight:bold;} .btext{font-family:avivabold; font-weight:bold;}.thintext{font-weight:normal;font-size:11px;margin:0 6px;}b{font-family:avivabold;}strong{font-family:avivabold;} table{border-spacing:0;border-collapse:collapse} .tr {padding: 0;margin: 0;}td,th{vertical-align: top;margin: 0;}.withBorder td {border: 1px solid #179db6;} .withBorderfooter td {border: 1px solid #000000;}.defaultColor td{border: 1px solid #0b8a44 !important;}.majentaColor td{border: 1px solid #b81e78 !important;}.blueColor td{border: 1px solid #07529a !important;}.navyColor td{border: 1px solid #422767 !important;}h1{font-size: 22px;font-weight: bold;line-height:12px;margin-top: 20px;text-align:center; word-spacing: 0px;}h2{font-size: 23px;font-weight: 600;margin-top: 10px;}h3{font-size: 22px;font-weight:normal;}ul {padding: 0;margin: 0;}.table p {font-size: 13px;line-height: 18px;text-align: justify;}.table p span {font-size: 14px;line-height:18px;font-weight: 600;}.inner-table {margin: 10px;}.inner-table .bordertd td {border: 1px solid;}span.recmd {background: #fcd904;padding:3px 5px;}th.spaceTop{padding-top:30px;}table{background-color:transparent}.table .center{text-align:center;}.table .left{text-align:left;}.colorfooter{background-color: #000000 !important;}.colordefaultfont{color:#0b8a44;font-weight:bold;}.colorMajenta{background-color: #b81e78 !important;}.colorMajentafont{color:#b81e78; font-weight:bold;}.colorBlue{background-color: #07529a !important;}.colorBluefont{color:#07529a; font-weight:bold;}.colornavy{background-color: #422767 !important;}.colornavyfont{color:#422767;font-weight:bold;}table{width:  100%;border: solid 1px #5544DD;}ul{list-style-type:none;padding:0;margin:0;}.paddingClass{padding:10px;}.fcolor{font-size:14px;line-height:16px;color:#fff;font-weight:bold; font-family: avivabold;}.withBorderfooter td p{font-size:10px;line-height:16px;font-weight:normal;}.withBorderfooter td p span{font-weight:700;}.thintext img{width:9px;height:9px;margin:0 2px;}</style>';
                $content .= '<page backtop="35mm" backbottom="5mm" backleft="2mm" backright="2mm">';
                $content .= '<page_header>';

                $content .= '<img src="' . $basePath . '/images/report-head.jpg" style="width: 100%" />';

                $content .= '</page_header>';
                $content .= '<table class="table">';
                if ($AnswerRollemp == '10' && ($AnswerNatureBusi == 'partnership' || ($AnswerkeyPeople != '0' && $AnswerEmployee == 'Significant impact/Business disruption') || ($loanTake != 'No' && $AnswerCurrentOut != '0'))) {
                    $content .= '<col style="width: 33.33%"/>    <col style="width: 33.33%"/>    <col style="width: 33.33%"/>';
                } elseif ($AnswerRollemp != '10' && ($AnswerNatureBusi != 'partnership' && ($AnswerkeyPeople == '0' && $AnswerEmployee != 'Significant impact/Business disruption') && ($loanTake == 'No'))) {
                    $content .= '<col style="width: 33.33%"/>    <col style="width: 33.33%"/>    <col style="width: 33.33%"/>';
                } elseif ($AnswerRollemp == '10' && ($AnswerNatureBusi != 'partnership' && ($AnswerkeyPeople == '0' && $AnswerEmployee != 'Significant impact/Business disruption') && ($loanTake == 'No'))) {
                    $content .= '<col style="width: 50%"/>    <col style="width: 50%"/>';
                } else {
                    $content .= '<col style="width: 25%"/>    <col style="width: 25%"/>    <col style="width: 25%"/> <col style="width: 25%"/>';
                }
                $content .= '<thead>';
                $content .= '<tr style="text-align:center;">';
                $content .= '<td colspan="4" style="" class="header-logo"></td>';
                $content .= '</tr>    </thead>';
                $content .= '<tbody style="padding:0; text-align: center;">';
                $content .= '<tr class="center" align="center"> <td colspan="4">';
                $content .= '<h2 style="margin-right: 400px;"><b>Aviva SME Assist Tool Analysis Report for ' . $clientName_long . '</b></h2>';
                $content .= '</td> </tr>';
                $content .= '<tr class="center" align="center"> <td colspan="4">';
                $content .= '<h3 style="text-align:center;">Overview – Types of Business Insurance Solutions</h3>';
                $content .= '</td> </tr>';
                $content .= '<tr class="center">';

                if ($AnswerRollemp == '10' && ($AnswerNatureBusi == 'partnership' || ($AnswerkeyPeople != '0' && $AnswerEmployee == 'Significant impact/Business disruption') || ($loanTake != 'No' && $AnswerCurrentOut != '0'))) {

                    $content .= '<td class="fcolor" style="background:#b81e78;padding:10px 0;margin:0">Business</td>';
                    $content .= '<td class="fcolor" style="background:#07529a;padding:10px 0;;text-align:center;vertical-align:middle;">Employer </td>';
                    $content .= '<td class="fcolor" style="background:#422767;padding:10px 0;">Family</td><td></td>';
                } elseif ($AnswerRollemp != '10' && ($AnswerNatureBusi != 'partnership' && ($AnswerEmployee != 'Significant impact/Business disruption') && ($loanTake == 'No'))) {

                    $content .= '<td class="fcolor" style="background:#0b8a44;padding:10px 0;">Statutory</td>';
                    $content .= '<td class="fcolor" style="background:#07529a;padding:10px 0;;text-align:center;vertical-align:middle;">Employer </td>';
                    $content .= '<td class="fcolor" style="background:#422767;padding:10px 0;">Family</td><td></td>';
                } elseif ($AnswerRollemp == '10' && ($AnswerNatureBusi != 'partnership' && ($AnswerEmployee != 'Significant impact/Business disruption' || $AnswerkeyPeople == '0') && ($loanTake == 'No'))) {

                    $content .= '<td class="fcolor" style="background:#07529a;padding:10px 0;;text-align:center;vertical-align:middle;">Employer </td>';
                    $content .= '<td class="fcolor" style="background:#422767;padding:10px 0;">Family</td><td></td><td></td>';
                } else {

                    $content .= '<td class="fcolor" style="background:#0b8a44;padding:10px 0px 10px 20px;text-align:left;">Statutory</td>';
                    $content .= '<td class="fcolor" style="background:#b81e78;padding:10px 0px 10px 20px;margin:0;text-align:left;">Business</td>';
                    $content .= '<td class="fcolor" style="background:#07529a;padding:10px 0px 10px 20px;text-align:center;vertical-align:middle;text-align:left;">Employer </td>';
                    $content .= '<td class="fcolor" style="background:#422767;padding:10px 0px 10px 20px;text-align:left;">Family</td>';
                }

                $content .= '</tr>';
                $content .= '<tr class="center withBorder">';

                //Statutory

                // echo "<br>AnswerRollemp:-".$AnswerRollemp;

                if ($AnswerRollemp == '10') {
                }

                if ($AnswerRollemp == '20') {
                    $content .= '<td class="paddingClass" style="text-align:left;">';

                    if ($AnswerGratuityEmp == 'I manage gratuity' && $AnswerEmpPF == 'My employees have EDLI policy') {
                        $content .= '<span class="btext"><span class="thintext"><img src="' . $basePath . '/images/red-dot.png"/></span> Gratuity</span> <br>';
                        $content .= '<span class="btext"><span class="thintext"><img src="' . $basePath . '/images/red-dot.png"/></span> EDLI</span>';
                    } elseif ($AnswerGratuityEmp != 'I manage gratuity' && $AnswerEmpPF == 'My employees have EDLI policy') {
                        $content .= '<span class="gtext"><span class="thintext"><img src="' . $basePath . '/images/green-dot.png"/></span> Gratuity</span> <br>';
                        $content .= '<span class="btext"><span class="thintext"><img src="' . $basePath . '/images/red-dot.png"/></span> EDLI</span>';
                    } elseif ($AnswerGratuityEmp == 'I manage gratuity' && $AnswerEmpPF != 'My employees have EDLI policy') {
                        $content .= '<span class="btext"><span class="thintext"><img src="' . $basePath . '/images/red-dot.png"/></span> Gratuity</span> <br>';
                        $content .= '<span class="gtext"><span class="thintext"><img src="' . $basePath . '/images/green-dot.png"/></span> EDLI</span>';
                    } else {
                        $content .= '<span class="gtext"><span class="thintext"><img src="' . $basePath . '/images/green-dot.png"/></span> Gratuity</span> <br>';
                        $content .= '<span class="gtext"><span class="thintext"><img src="' . $basePath . '/images/green-dot.png"/></span> EDLI</span>';
                    }
                    $content .= '</td>';
                } elseif ($AnswerRollemp == '10-20') {
                    $content .= '<td class="paddingClass" style="text-align:left;">';

                    if ($AnswerGratuityEmp == 'I manage gratuity') {
                        $content .= '<span class="btext"><span class="thintext"><img src="' . $basePath . '/images/red-dot.png"/></span> Gratuity</span> <br>';
                    } else {
                        $content .= '<span class="gtext"><span class="thintext"><img src="' . $basePath . '/images/green-dot.png"/></span> Gratuity</span> <br>';
                    }
                    $content .= '</td>';
                }


                //Business
                if ($AnswerNatureBusi == 'partnership' || ($AnswerkeyPeople != '0' && $AnswerEmployee == 'Significant impact/Business disruption') || ($loanTake != 'No')) {
                    $content .= '<td class="paddingClass" style="text-align:left;">';
                    if ($AnswerNatureBusi != 'partnership') {
                        $content .= '';
                    } elseif ($AnswerNatureBusi == 'partnership' && $AnswerbusinessIncPI == 'Partnership Insurance') {
                        $content .= '<span class="gtext"><span class="thintext"><img src="' . $basePath . '/images/green-dot.png"/></span>Partnership Insurance <br></span>';
                    } elseif ($AnswerNatureBusi == 'partnership' && $AnswerbusinessIncPI != 'Partnership Insurance') {
                        $content .= '<span class="btext"><span class="thintext"><img src="' . $basePath . '/images/red-dot.png"/></span>Partnership Insurance <br></span>';
                    }

                    if ($loanTake != 'No' && $AnswerCurrentOut != '0') {
                        $content .= '<span class="btext"><span class="thintext"><img src="' . $basePath . '/images/red-dot.png"/></span> Loan Protect</span> <br/>';
                    }


                    if ($AnswerkeyPeople != '0' && $AnswerEmployee == 'Significant impact/Business disruption') {
                        if ($AnswerbusinessIncKM == 'Key Man') {
                            $content .= '<span class="gtext"><span class="thintext"><img src="' . $basePath . '/images/green-dot.png"/></span> Key Man </span>';
                        } else {
//                            $content .= '<span class="btext"><span class="thintext"><img src="' . $basePath . '/images/red-dot.png"/></span>  Key Man </span>';
                        }
                    }

                    $content .= '</td>';
                } else {
                }
                //Employer
                $content .= '<td class="paddingClass" style="text-align:left;">';
                if ($AnswerbusinessIncEEP == 'Employer Employee Policy') {
                    $content .= '<span class="gtext"><span class="thintext"><img src="' . $basePath . '/images/green-dot.png"/></span> Employer Employee<br/></span>';
                } else {
                    $content .= '<span class="btext"><span class="thintext"><img src="' . $basePath . '/images/red-dot.png"/></span>Employer-Employee </span><br/>';
                }
                if ($AnswerRollemp == '20') {
                    $content .= '<span class="btext"><span class="thintext"><img src="' . $basePath . '/images/red-dot.png"/></span> Salary Protect</span>';
                }
                $content .= '</td>';

                //Family
                if ($AgeDiff <= $maxAge || $AnswerSpecificIn == 'No' || $AnswerHousehold != 'I am adequately insured; the family will not have significant financial issues' || $AnswerFam != 'Spouse' || $AnswerRetiremnt == 'Have not planned') {
                    // echo "in family if";
                    // echo "<br>age diff:-".$AgeDiff;
                    // echo "<br>maxAge:-".$maxAge;
                    // echo "<br>annualIncomes:-".$annualIncomes;
                    // echo "<br>totalsaving:-".$totalsaving;
                    // echo "<br>AnswerHousehold:-".$AnswerHousehold;
                    // echo "<br>AnswerSpecificIn:-".$AnswerSpecificIn;
                    // echo "<br>AnswerRetiremnt:-".$AnswerRetiremnt;

                    $content .= '<td class="paddingClass" style="text-align:left;">';
                    if ($AgeDiff <= $maxAge) {
                        if ($annualIncomes < '2000000' && $AnswerHousehold == 'I am adequately insured; the family will not have significant financial issues') {
                            $content .= '<span class="btext"><span class="thintext"><img src="' . $basePath . '/images/green-dot.png"/></span> Term Cover </span> <br/>';
                        }
                        if ($annualIncomes >= '2000000' && $totalsaving == 0) {
                            $content .= '<span class="btext"><span class="thintext"><img src="' . $basePath . '/images/red-dot.png"/></span> Term Cover </span> <br/>';
                        }
                        if ($annualIncomes >= '2000000' && $totalsaving > 0) {
                            $content .= '<span class="btext"><span class="thintext"><img src="' . $basePath . '/images/yellow-dot.png"/></span> Term Cover </span> <br/>';
                        }
                    }

                    if ($AnswerSpecificIn == 'No' && $AnswerHousehold != 'I am adequately insured; the family will not have significant financial issues') {
                        $content .= '<span class="btext"><span class="thintext"><img src="' . $basePath . '/images/red-dot.png"/></span>Health </span><br/>';
                    }
                    if ($AnswerFam != 'Spouse') {
                        $content .= '<span class="btext"><span class="thintext"><img src="' . $basePath . '/images/red-dot.png"/></span> Child</span> <br/>';
                    }
                    if ($AnswerSpecificIn == 'No' && $AnswerHousehold != 'I am adequately insured; the family will not have significant financial issues') {
                        $content .= '<span class="btext"><span class="thintext"><img src="' . $basePath . '/images/red-dot.png"/></span> Savings</span> <br/>';
                    }
                    if ($AnswerRetiremnt == 'Have not planned') {
                        $content .= '<span class="btext"><span class="thintext"><img src="' . $basePath . '/images/red-dot.png"/></span> Retirement Plan</span> <br/>';
                    }
                    $content .= '</td>';
                }
                $content .= '</tr>';
                $content .= '</tbody></table>';


                $content .= '<table class="table">';
                $content .= '<col style="width: 100%"/>';
                $content .= '<thead>';
                $content .= '<tr><td></td></tr>';
                $content .= '</thead>';
                $content .= '<tbody style="padding:0;">';
                $content .= '<tr style="text-align:right;"><td>&nbsp;</td></tr>';
                $content .= '<tr style="text-align:right;">';
                $content .= '<td><span class="thintext"><img src="' . $basePath . '/images/green-dot.png"/> Already covered</span><span class="thintext"><img src="' . $basePath . '/images/red-dot.png"/> Required, yet to be covered</span> <span class="thintext"><img src="' . $basePath . '/images/yellow-dot.png"/> Covered, but not adequate</span></td></tr>';
                $content .= '</tbody></table>';


                $content .= '<table class="table">';
                $content .= '<col style="width: 25%"/>    <col style="width: 25%"/>    <col style="width: 25%"/> <col style="width: 25%"/>';
                $content .= '<thead>';
                $content .= '<tr><td></td><td></td><td></td><td></td></tr>';
                $content .= '<tr style="text-align:center;">';
                $content .= '<td colspan="4" style="" class="header-logo"></td>';
                $content .= '</tr>    </thead>';
                $content .= '<tbody style="padding:0;">';

                $content .= '<tr class="center">';
                $content .= '<td colspan="4"><h2>Detailed Analysis</h2></td>';
                $content .= '</tr>';


                if ($AnswerRollemp == '20') {
                    if ($AnswerGratuityEmp == 'I manage gratuity' && $AnswerEmpPF == 'My employees have EDLI policy') {
                        $content .= '<tr class="center">';
                        $content .= '<td class="fcolor" colspan="4" style="background:#0b8a44;padding:10px 0;">Statutory Requirements   </td>';
                        $content .= '</tr>';
                    } elseif ($AnswerGratuityEmp != 'I manage gratuity' && $AnswerEmpPF == 'My employees have EDLI policy') {
                        $content .= '<tr class="center">';
                        $content .= '<td class="fcolor" colspan="4" style="background:#0b8a44;padding:10px 0;">Statutory Requirements   </td>';
                        $content .= '</tr>';
                    } elseif ($AnswerGratuityEmp == 'I manage gratuity' && $AnswerEmpPF != 'My employees have EDLI policy') {
                        $content .= '<tr class="center">';
                        $content .= '<td class="fcolor" colspan="4" style="background:#0b8a44;padding:10px 0;">Statutory Requirements   </td>';
                        $content .= '</tr>';
                    } else {
                    }
                } elseif ($AnswerRollemp == '10-20') {
                    if ($AnswerGratuityEmp == 'I manage gratuity') {
                        $content .= '<tr class="center">';
                        $content .= '<td class="fcolor" colspan="4" style="background:#0b8a44;padding:10px 0;">Statutory Requirements   </td>';
                        $content .= '</tr>';
                    } else {
                    }
                }
                $content .= '</tbody>';
                $content .= '</table>';


                //Statutory Requirements

                //-------
                if (($AnswerRollemp == '20' || $AnswerRollemp == '10-20') && $AnswerGratuityEmp == 'I manage gratuity') {
                    $content .= '<table class="table">';
                    $content .= '<col style="width: 25%"/>    <col style="width: 25%"/>    <col style="width: 25%"/> <col style="width: 25%"/>';
                    $content .= '<thead>';
                    $content .= '<tr><td></td><td></td><td></td><td></td></tr>';
                    $content .= '</thead>';
                    $content .= '<tbody>';
                    $content .= '<tr class="left withBorder defaultColor">';

                    if (($AnswerGratuityEmp == 'I manage gratuity' && $AnswerEmpPF != 'My employees have EDLI policy') || ($AnswerGratuityEmp != 'I manage gratuity' && $AnswerEmpPF == 'My employees have EDLI policy')) {
                        $colST = '4';
                    } else {
                        $colST = '2';
                    }


                    if ($AnswerRollemp == '10') {
                    }
                    if ($AnswerRollemp == '20') {
                        if ($AnswerGratuityEmp == 'I manage gratuity' && $AnswerEmpPF == 'My employees have EDLI policy') {
                            $content .= '<td class="paddingClass" colspan="' . $colST . '">';
                            $content .= '<p><span class="colordefaultfont">Gratuity:</span> You will need to provide Gratuity benefit   to your employees for rendering services continuously for five years or more.</p>';
                            $content .= '</td>';
                            $content .= '<td class="paddingClass" colspan="' . $colST . '">';
                            $content .= '<p><span class="colordefaultfont">Employees Deposit Linked Insurance:</span> As a business owner you need to provide Employees Deposit Linked Insurance to your employees. The insured employee’s beneficiary will receive a lump sum in the event of the employee’s demise. Compulsory for all employees earning a basic pay of   Rs.6,500 per month.</p>';
                            $content .= '</td>';
                        } elseif ($AnswerGratuityEmp != 'I manage gratuity' && $AnswerEmpPF == 'My employees have EDLI policy') {
                            $content .= '<td class="paddingClass" colspan="' . $colST . '">';
                            $content .= '<p><span class="colordefaultfont">Employees Deposit Linked Insurance:</span> As a business owner you need to provide Employees Deposit Linked Insurance to your employees. The insured employee’s beneficiary will receive a lump sum in the event of the employee’s demise. Compulsory for all employees earning a basic pay of   Rs.6,500 per month.</p>';
                            $content .= '</td>';
                        } elseif ($AnswerGratuityEmp == 'I manage gratuity' && $AnswerEmpPF != 'My employees have EDLI policy') {
                            $content .= '<td class="paddingClass" colspan="' . $colST . '">';
                            $content .= '<p><span class="colordefaultfont">Gratuity:</span> You will need to provide Gratuity benefit   to your employees for rendering services continuously for five years or more.</p>';
                            $content .= '</td>';
                        } else {
                        }
                    } elseif ($AnswerRollemp == '10-20') {
                        if ($AnswerGratuityEmp == 'I manage gratuity') {
                            $content .= '<td class="paddingClass" colspan="4">';
                            $content .= '<p><span class="colordefaultfont">Gratuity:</span> You will need to provide Gratuity benefit   to your employees for rendering services continuously for five years or more.</p>';
                            $content .= '</td>';
                        } else {
                        }
                    }

                    $content .= '</tr>';
                    $content .= '<tr class="center">';
                    $content .= '<td colspan="4">';
                    $content .= '<!--blank td--> &nbsp;';
                    $content .= '</td>';
                    $content .= '<br>';
                    $content .= '</tr>';
                    $content .= '</tbody>';
                    $content .= '</table>';
                } else {
                }


                //Business Requirements

                if (($AnswerNatureBusi == 'partnership' && $AnswerbusinessIncPI != 'Partnership Insurance') || ($AnswerkeyPeople != '0' && $AnswerbusinessIncKM != 'Key Man' && $AnswerEmployee == 'Significant impact/Business disruption') || ($loanTake != 'No' && $AnswerCurrentOut > 0)) {
                    $content .= '<table class="table" style="margin-top:-7px;">';
                    $content .= '<col style="width: 25%"/>    <col style="width: 25%"/>    <col style="width: 25%"/> <col style="width: 25%"/>';
                    $content .= '<thead>';

                    $content .= '<tr class="center">';
                    $content .= '<td class="fcolor" colspan="4" style="background:#b81e78;padding:10px 0;"> YOUR ROLE AS A BUSINESS OWNER   </td>';
                    $content .= '</tr>';

                    $content .= '</thead>';
                    $content .= '<tbody>';


                    if ($AnswerbusinessIncPI == 'Partnership Insurance') {
                    } elseif ($AnswerNatureBusi == 'partnership') {
                        //    if(($AnswerNatureBusi=='partnership' && $AnswerbusinessIncKM!='Key Man') && ($AnswerkeyPeople != '0' && $AnswerEmployee=='Significant impact/Business disruption'))
                        //   { $colPar='2'; } else{ $colPar='4'; }
                        $content .= '<tr class="withBorder majentaColor">';
                        $content .= '<td class="paddingClass" colspan="4">';
                        $content .= '<p><span class="colorMajentafont">Partnership Insurance:</span> This helps in case one partner passes away and his family does not wish to continue in the business. The benefit is paid to the    firm such that The share of the deceased partner can be bought by the other partners.</p>';

                        $content .= '<table style="margin-top:10px;" border="0" bgcolor="#fcd904"><tbody><tr border="0"><td border="0" style="padding:5px 7px;">Recommended for you:</td></tr></tbody></table>';
                        $content .= '<p>Basis the number of partners, you should opt for    partnership insurance for each of the partners as below:</p>';
                        $content .= '<table class="table inner-table" style="padding:0;margin:0;"><col style="width: 50%"><col style="width: 50%">';
                        $content .= '<thead>     <tr class="center">';
                        $content .= '<td colspan="2">';
                        $content .= '<!--blank td-->';
                        $content .= '</td>';
                        $content .= '</tr>';
                        $content .= '</thead>';
                        $content .= '<tbody>';
                        $content .= '<tr class="left fcolor">';
                        $content .= '<td class="fcolor paddingClass" style="background:#b81e78;margin:0;border:0">Partner</td>';
                        $content .= '<td class="fcolor paddingClass" style="background:#b81e78;margin:0;border:0">Sum Assured (Rs.)</td>';

                        $content .= '</tr>';
                        if ($partnerAAssets != '0.00') {
                            $content .= '<tr class="left bordertd">';
                            $content .= '<td class="paddingClass" style="border:1px solid #b81e78;">Partner A</td>';
                            $content .= '<td class="paddingClass" style=" border:1px solid #b81e78;">' . $final1partinsval . '</td>';
                            $content .= '</tr>';
                        }
                        if ($partnerBAssets != '0.00') {
                            $content .= '<tr class="left bordertd">';
                            $content .= '<td class="paddingClass" style=" border:1px solid #b81e78;">Partner B</td>';
                            $content .= '<td class="paddingClass" style=" border:1px solid #b81e78;">' . $final2partinsval . '</td>';
                            $content .= '</tr>';
                        }
                        if ($partnerCAssets != '0.00') {
                            $content .= '<tr class="left bordertd">';
                            $content .= '<td class="paddingClass" style="border:1px solid #b81e78;">Partner C</td>';
                            $content .= '<td class="paddingClass" style=" border:1px solid #b81e78;">' . $final3partinsval . '</td>';
                            $content .= '</tr>';
                        }
                        if ($partnerDAssets != '0.00') {
                            $content .= '<tr class="left bordertd">';
                            $content .= '<td class="paddingClass" style=" border:1px solid #b81e78;">Partner D</td>';
                            $content .= '<td class="paddingClass" style=" border:1px solid #b81e78;">' . $final4partinsval . '</td>';
                            $content .= '</tr>';
                        }
                        if ($partnerEAssets != '0.00') {
                            $content .= '<tr class="left bordertd">';
                            $content .= '<td class="paddingClass" style=" border:1px solid #b81e78;">Other Partners</td>';
                            $content .= '<td class="paddingClass" style=" border:1px solid #b81e78;">' . $final5partinsval . '</td>';
                            $content .= '</tr>';
                        }

                        $content .= '</tbody>';
                        $content .= '</table>';
                        $content .= '</td>';
                        $content .= '</tr>';
                    }
                    if ($AnswerkeyPeople != '0' && $AnswerbusinessIncKM != 'Key Man' && $AnswerEmployee == 'Significant impact/Business disruption' && $loanTake != 'No' && $AnswerCurrentOut != '0') {
                        $colKey = '4';
                    } else {
                        $colKey = '4';
                    }

                    $content .= '<tr class="withBorder majentaColor">';
//                    if ($AnswerkeyPeople != '0' && $AnswerbusinessIncKM != 'Key Man' && $AnswerEmployee == 'Significant impact/Business disruption') {
//                        $content .= '<td class="paddingClass" colspan="' . $colKey . '">';
//                        $content .= '<p><span class="colorMajentafont">Key Man Insurance:</span> Your business is highly    dependent on your key employees. A sudden loss of any of these key employees could have a significant financial impact on your business. Key man insurance helps to manage these risks and ensures the company has suficient funds to keep the  business going in the short term before a successor takes charge.</p>';
//                        $content .= '<table style="margin-top:10px;" border="0" bgcolor="#fcd904"><tbody><tr border="0"><td border="0" style="padding:5px 7px;">Recommended for you:</td></tr></tbody></table>';
//                        $content .= '<p>We recommend you opt for a Key Man insurance of ' . $AsetVal . '    for each of your key employees.</p>';
//                        $content .= '</td>';
//                    }


                    if ($loanTake != 'No' && $AnswerCurrentOut != '0') {
                        $content .= '<td colspan="' . $colKey . '" class="paddingClass">';
                        $content .= '<p><span class="colorMajentafont">Loan Protect:</span> In the unfortunate event of the death of the breadwinner, in case there is an outstanding loan, the burden of repayment falls on the family. Inability to service the loan can lead to creditors selling your assets. Opting for a Loan Protect solution will help secure your family against such uncertainties.</p>';
                        $content .= '<table style="margin-top:10px;" border="0" bgcolor="#fcd904"><tbody><tr border="0"><td border="0" style="padding:5px 7px;">Recommended for you:</td></tr></tbody></table>';
                        $content .= '<p>Given your Outstanding liabilities as disclosed, you may opt for a loan cover of Rs. ' . $LoanOutValue . '.</p>';
                        $content .= '</td>';
                    }
                    $content .= '</tr>';
                    $content .= '<tr><td></td><td></td><td></td><td></td></tr>';
                    $content .= '</tbody>';
                    $content .= '</table>';
                }

                $content .= '<table class="table"> <col style="width: 25%"/> <col style="width: 25%"/> <col style="width: 25%"/> <col style="width: 25%"/>';
                $content .= '<tr class="center">';
                $content .= '<td><br/> </td>';
                $content .= '</tr>';
                $content .= '</table>';

                //Employer Requirements

                if ($AnswerbusinessIncEEP != 'Employer Employee Policy' && $AnswerRollemp == '20') {
                    $colEmp = '2';
                } else {
                    $colEmp = '4';
                }
                if ($AnswerbusinessIncEEP != 'Employer Employee Policy' || $AnswerRollemp == '20') {
                    $content .= '<div>';
                    $content .= '<table class="table" style="margin-top:-7px;"> <col style="width: 25%"/> <col style="width: 25%"/> <col style="width: 25%"/> <col style="width: 25%"/>';
                    $content .= '<thead>';
                    $content .= '<tr class="center">';
                    $content .= '<td class="fcolor" colspan="4" style="background:#07529a;padding:10px 0;">YOUR ROLE AS AN EMPLOYER';
                    $content .= '</td>';
                    $content .= '</tr>';
                    $content .= '</thead><tbody style="padding:0;">';
                    $content .= '<tr class="withBorder blueColor">';


                    if ($AnswerbusinessIncEEP != 'Employer Employee Policy') {
                        $content .= '<td class="paddingClass" colspan="' . $colEmp . '">';
                        $content .= '<p><span class="colorBluefont">Employer-Employee:</span> An employer-employee policy is bought by the firm on the life of the  employee for the benefit of employee’s family. The  firm gets tax benefits u/s 37 (1).</p>';
                        $content .= '<table style="margin-top:10px;" border="0" bgcolor="#fcd904"><tbody><tr border="0"><td border="0" style="padding:5px 7px;">Recommended for you:</td></tr></tbody></table>';
                        $content .= '<p>As disclosed by you, in order to curb attrition, employer employee policy might be helpful.</p>';
                        $content .= '</td>';
                    }
                    if ($AnswerRollemp == '20') {
                        $content .= '<td class="paddingClass" colspan="' . $colEmp . '">';
                        $content .= '<p><span class="colorBluefont">Salary Protect:</span> Engaged employees are more   productive. Salary Protect helps protect the families of your employees by securing their income for up to 10 years.</p>';
                        $content .= '</td>';
                    }
                    $content .= '</tr>';
                    $content .= '<tr><td></td><td></td><td></td><td></td></tr>';
                    $content .= '</tbody>';
                    $content .= '</table>';
                    $content .= '</div>';
                    $content .= '<table class="table"> <col style="width: 25%"/> <col style="width: 25%"/> <col style="width: 25%"/> <col style="width: 25%"/>';
                    $content .= '<tr class="center">';
                    $content .= '<td><br/> </td>';
                    $content .= '</tr>';
                    $content .= '</table>';
                } else {
                }


                //Family Requirements

                $content .= '<table class="table" style="margin-top:-7px;"> <col style="width: 25%"/> <col style="width: 25%"/> <col style="width: 25%"/> <col style="width: 25%"/>';
                $content .= '<thead>';
                $content .= '<tr class="center">';
                $content .= '<td class="fcolor" colspan="4" style="background:#422767;padding:10px 0;">YOUR ROLE AS THE HEAD OF FAMILY';
                $content .= '</td>';
                $content .= '</tr>';
                $content .= '</thead><tbody style="padding:0;">';


                if ($AgeDiff <= $maxAge && $AnswerHousehold != 'I am adequately insured; the family will not have significant financial issues' && $AnswerSpecificIn == 'No' && $AnswerHousehold != 'I am adequately insured; the family will not have significant financial issues') {
                    $col89 = '2';
                } else {
                    $col89 = '4';
                }

                $content .= '<tr class="withBorder navyColor">';
                if ($AgeDiff <= $maxAge) {
                    if ($AnswerHousehold != 'I am adequately insured; the family will not have significant financial issues') {
                        $content .= '<td class="paddingClass" colspan="' . $col89 . '" >';
                        $content .= '<p><span class="colornavyfont">Term Cover:</span> A term plan provides financial security to your loved ones in case you are not around</p>';
                        $content .= '<table style="margin-top:10px;" border="0" bgcolor="#fcd904"><tbody><tr border="0"><td border="0" style="padding:5px 7px;">Recommended for you:</td></tr></tbody></table>';
                        if ($annualIncomes <= '2000000') {
                            $content .= '<p>Great! you are adequately covered.</p>';
                        } elseif ($annualIncomes > '2000000' && $annualIncomes <= '2500000') {
                            $content .= '<p>Basis your family and business situation we recommend a term cover of Rs.25,00,000, For Prermium of Rs.' . money_format('%!.0n', $rebatepremiumon25) . ' Yearly.</p>';
                        } elseif ($annualIncomes > '2500000') {
                            if ($annualIncomes > '2500000' && $annualIncomes < 10000000) {
                                $newAnnualIncome = ($annualIncomes / 100000) . ' Lacs';
                            } elseif ($annualIncomes >= 10000000) {
                                $newAnnualIncome = ($annualIncomes / 10000000) . ' Crores';
                            }
                            $content .= '<p>Basis your inputs a term cover of ' . $newAnnualIncome . '  might be opted for. (which is 20 times of your annual income)</p>';
                        }
                        $content .= '</td>';
                    }
                }
                if ($AnswerSpecificIn == 'No' && $AnswerHousehold != 'I am adequately insured; the family will not have significant financial issues') {
                    $content .= '<td class="paddingClass" colspan="' . $col89 . '">';
                    $content .= '<p><span class="colornavyfont">Health Plans:</span> The cost of treatment and hospitalisation of illnesses may cause a serious dent in your savings, a health plan helps to cover that</p>';
                    $content .= '<table style="margin-top:10px;" border="0" bgcolor="#fcd904"><tbody><tr border="0"><td border="0" style="padding:5px 7px;">Recommended for you:</td></tr></tbody></table>';
                    $content .= '<p>Given the increased cost of treatment, a health cover 20 lacs might be opted for!</p>';
                    $content .= '</td>';
                }
                $content .= '</tr>';

                if ($AnswerFam != 'Spouse' && $AnswerSpecificIn == 'No' && $AnswerHousehold != 'I am adequately insured; the family will not have significant financial issues') {
                    $col90 = '2';
                } else {
                    $col90 = '4';
                }
                $content .= '<tr class="left withBorder navyColor">';
                if ($AnswerFam != 'Spouse') {
                    $content .= '<td class="paddingClass" colspan="' . $col90 . '" >';
                    $content .= '<p><span class="colornavyfont">Child Plans:</span> Child Plans are targeted at creating a secured pool of money for specific goals like Education, Marriage and Start of Life of the child. There could be plans that provide regular / periodic payouts or provide a lump sum payout.</p>';
                    $content .= '</td>';
                }
                $savingsvalue = (int)$AnswerAnn * 10000;
                if ($savingsvalue < 100000) {
                    $savedrs = money_format('%!.0n', $savingsvalue);
                } else {
                    $savedrs = 'Rs.' . ($savingsvalue / 100000) . ' Lacs';
                }

                if ($AnswerSpecificIn == 'No' && $AnswerHousehold != 'I am adequately insured; the family will not have significant financial issues') {
                    $content .= '<td class="paddingClass" colspan="' . $col90 . '">';
                    $content .= '<p><span class="colornavyfont">Savings Plan:</span> Investment oriented insurance plans help create wealth for the future with the benefit of tax-saving as per prevailing tax laws.</p>';
                    $content .= '<table style="margin-top:10px;" border="0" bgcolor="#fcd904"><tbody><tr border="0"><td border="0" style="padding:5px 7px;">Recommended for you:</td></tr></tbody></table>';
                    $content .= '<p>Basis your inputs, you may consider saving a ' . $savedrs . ' (10% of annual income)  per annum</p>';
                    $content .= '</td>';
                }
                $content .= '</tr>';

                if (($AnswerInsurn == 'Yes' && $AnswerRetiremnt == 'Have not planned') || ($AnswerInsurn != 'Yes' && $AnswerRetiremnt != 'Have not planned')) {
                    $colbu = '2';
                } else {
                    $colbu = '4';
                }

                $content .= '<tr class="withBorder navyColor">';
                if ($AnswerRetiremnt == 'Have not planned') {
                    $content .= '<td colspan="' . $colbu . '" class="paddingClass">';
                    $content .= '<p><span class="colornavyfont">Retirement Plan</span>Saving now for retirement will ensure that you have enough money to enjoy maintain your standard of living in the golden years of your life.</p>';
                    $content .= ' </td>';
                }
                if ($AnswerInsurn == 'Yes') {
                    $content .= '<td colspan="' . $colbu . '" class="paddingClass">';
                    $content .= '<p><span class="colornavyfont">MWPA:</span> Any insurance policy endorsed under the MWPA (Married Women’s Property Act) is safeguarded from creditors. This Act ensures that the insurance payout stays only with your wife and children.</p>';
                    $content .= ' </td>';
                }
                $content .= '</tr>';

                $content .= '<tr><td></td><td></td><td></td><td></td></tr>';
                $content .= '</tbody>';
                $content .= '</table>';

                $content .= '<table class="table"> <col style="width: 25%"/> <col style="width: 25%"/> <col style="width: 25%"/> <col style="width: 25%"/>';
                $content .= '<tr class="center">';
                $content .= '<td><br/> </td>';
                $content .= '</tr>';
                $content .= '</table>';
                $content .= '<table class="table"> <col style="width: 25%"/> <col style="width: 25%"/> <col style="width: 25%"/> <col style="width: 25%"/>';
                $content .= '<tr class="center">';
                $content .= '<td><br/> </td>';
                $content .= '</tr>';
                $content .= '</table>';
                $content .= '<table class="table" style="padding:0;margin:0;"><col style="width: 33.3%">    <col style="width: 33.3%"><col style="width: 33.3%"><thead>';
                $content .= '<tr class="center">';
                $content .= '<td colspan="3">';
                $content .= '<!--blank td-->';
                $content .= '</td>';
                $content .= '</tr>';
                $content .= '</thead>';
                $content .= '<tbody>';
                $content .= '<tr class="center withBorderfooter">';
                $content .= '<td class="paddingClass"><p style="text-align:center;"><img src="' . $basePath . '/images/add.png"/><br><br/><span style="font-size:12px;">Aviva Life Insurance Company India Limited</span> <br/>Aviva Tower, Sector Road, Opposite Golf Course DLF Phase-V, Sector 43, Gurugram-122003 www.avivaindia.com</p></td>';
                $content .= '<td class="paddingClass"><p style="text-align:center;"><img src="' . $basePath . '/images/tel.png"/><br/><br/><span style="font-size:12px;">Customer Service Helpline Number</span> 1800-103-77-66 (Toll Free) 0124-270-9046</p></td>';
                $content .= '<td class="paddingClass"><p style="text-align:center;"><img src="' . $basePath . '/images/mail.png"/><br/><br/><span style="font-size:12px;">Email</span><br/> customerservices@avivaindia.com</p></td>';
                $content .= '</tr>';
                $content .= '</tbody>';
                $content .= '</table>';
                $content .= '<table class="table" style="padding:0;margin:0;"><col style="width: 100%"> <thead>';
                $content .= '<tr class="center">';
                $content .= '<td colspan="1">';
                $content .= '<!--blank td-->';
                $content .= '</td>';
                $content .= '</tr>';
                $content .= '</thead>';
                $content .= '<tbody>';
                $content .= '<tr class="center">';
                $content .= '<td class="paddingClass">';
                $content .= '<p style="text-align:left;"><span style="font-weight:bold;">Risk Disclaimer:</span><br><br></p>';
                $content .= '<table align="center">';
                $content .= '<tr>';
                $content .= '<td align="center"><img src="' . $basePath . '/images/aviva-logo-sme.png" width="220"/></td>';
                $content .= '</tr>';
                $content .= '<tr>';
                $content .= '<td align="center" style="font-size:17px; font-family:Times New Roman,serif">A joint venture berween Dabur Invest Corp and AVIVA International Holding limited</td>';
                $content .= '</tr>';
                $content .= '<tr>';
                $content .= '<td align="center" style="font-size:13px; font-family:arial; line-height:22px;"><strong>Aviva Life Insurance Company India Limited</strong><br>Head Office: Aviva Tower, Sector Road, Opposite Golf Course, DLF Phase - V, Sector43, Gurugram - 122003, Haryana, India<br>Tel.: +91 0124-2709000, Fax: +91 0124-2571210<br>Website: www.avivaindia.com<br>Email: customerservices@avivaindia.com<br><br>Registered Office: 2nd floor, Prakashdeep Building, 7 Tolstoy Marg, New Delhi - 110030, India<br><br>IRDAI Registration No: 122<br>Corporate Identity Number (CIN No): U66010DL2000PLC107880<br>Aviva Trade logo displayed above belongs to Aviva Brands Limited and is used by Aviva Life Insurance Company India Limited under License.</td>';
                $content .= '</tr>';
                $content .= '</table>';
                $content .= '</td>';
                $content .= '</tr>';
                $content .= '</tbody>';
                $content .= '</table>';

                $content .= '</page>';

				$html2pdf = new HTML2PDF('P', 'A4', 'en', 'true', 'UTF-8', array(0, 5, 0, 5));
				$html2pdf->AddFont('helvetica', '', 'helvetica.php');
				$html2pdf->AddFont('helvetica', 'B', 'helveticab.php');
				$html2pdf->AddFont('helvetica', 'I', 'helveticai.php');

				$html2pdf->setDefaultFont("helvetica");

				$html2pdf->writeHTML($content);
				ob_end_clean();
				$html2pdf->output('document.pdf', 'D');

            } catch (Exception $e) {
                 echo "error :-".$e->getMessage();
            }
        } else {
			echo "nothing found";
        }
    }

    public function money_format($format,$value){
        if ($value<0) return "-".asDollars(-$value);
          return '$' . number_format($value, 0);
    }

        
}

?>
