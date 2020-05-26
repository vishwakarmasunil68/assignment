<?php

require APPPATH . 'libraries/REST_Controller.php';
header('Access-Control-Allow-Origin: *');
     
class User extends REST_Controller {
    
     
    public function __construct() {
       parent::__construct();
       $this->load->database();
       $this->load->model('UserModel');
       $this->load->model('PdfModel');
    }
     
    public function test_get(){
        echo "testing";
    }

    public function checkAdminLogin_get(){
		$username=$_GET["user_name"];
		$password=$_GET["password"];
		$admin_user=$this->PdfModel->getAdminUser($username,$password);
//		echo "json:-".json_encode($admin_user);
		if($admin_user){
			$this->set_response(array('status'=>1,'message'=>'users found'));
		}else{
			$this->set_response(array('status'=>0,'message'=>'no user found'));
		}
	}

    public function getAllUsers_get(){


    	$from_date=$_GET["from_date"];
		$to_date=$_GET["to_date"];

    	$all_users=$this->PdfModel->getAllUsersFROMTO($from_date,$to_date);
    	if($all_users){
    		$userList=array();
    		for($i=0;$i<count($all_users);$i++){

				$userData=$this->PdfModel->getUser($all_users[$i]->user_id);
				// echo "userdata:-".json_encode($userData);
				$userData->businessData=$this->PdfModel->getBusinessByUserID($all_users[$i]->user_id);
				$userData->employeeData=$this->PdfModel->getEmployerByUserID($all_users[$i]->user_id);
				$userData->hofData=$this->PdfModel->getHOFByUserID($all_users[$i]->user_id);

    			array_push($userList,$userData);
			}

			$this->set_response(array('status'=>1,'message'=>'users found','result'=>$userList));
		}else{
			$this->set_response(array('status'=>0,'message'=>'users not found'));
		}
	}

    public function insertUser_post(){
    	$salutation=$this->input->post('salutation');
    	$name=$this->input->post('name');
    	$dob=$this->input->post('dob');
    	$mobile=$this->input->post('mobile');
    	$email_id=$this->input->post('email_id');
    	$company_name=$this->input->post('company_name');
    	$city=$this->input->post('city');
    	$aviva_emp_id=$this->input->post('aviva_emp_id');

    	$date = date('Y-m-d H:i:s');

    	$added_on=$date;

    	$data=$this->UserModel->insertUser($salutation,$name,$dob,$mobile,$email_id,$company_name,$city,$aviva_emp_id,$added_on);

    	$this->set_response($data);
    }

    public function saveBusinessOwner_post(){
    
    	$user_id=$this->input->post('user_id');
    	$q1=$this->input->post('q1');
    	$q1a=$this->input->post('q1a');
    	$q2=$this->input->post('q2');
    	$q3=$this->input->post('q3');
    	$q4=$this->input->post('q4');
    	$q5=$this->input->post('q5');
    	$q5a=$this->input->post('q5a');


    	$data=$this->UserModel->saveBusinessOwner($user_id,$q1,$q1a,$q2,$q3,$q4,$q5,$q5a);

    	$this->set_response($data);
    }

    public function saveEmployer_post(){
    
    	$user_id=$this->input->post('user_id');
    	$q1=$this->input->post('q1');
    	$q2=$this->input->post('q2');
    	$q3=$this->input->post('q3');
    	$q4=$this->input->post('q4');
    	$q5=$this->input->post('q5');
    	$q6=$this->input->post('q6');


    	$data=$this->UserModel->saveEmployer($user_id,$q1,$q2,$q3,$q4,$q5,$q6);

    	$this->set_response($data);
    }

    public function saveHOF_post(){
    
    	$user_id=$this->input->post('user_id');
    	$q1=$this->input->post('q1');
    	$q2=$this->input->post('q2');
    	$q3=$this->input->post('q3');
    	$q4=$this->input->post('q4');
    	$q5=$this->input->post('q5');
    	$q6=$this->input->post('q6');
    	$q7=$this->input->post('q7');
    	$q8=$this->input->post('q8');
    	$q9=$this->input->post('q9');
    	$q10=$this->input->post('q10');


    	$data=$this->UserModel->saveHOF($user_id,$q1,$q2,$q3,$q4,$q5,$q6,$q7,$q8,$q9,$q10);

    	$this->set_response($data);
    }
    
        
}

?>
