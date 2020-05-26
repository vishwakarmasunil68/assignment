<?php
class UserModel extends CI_Model {

        public function __construct()
        {
                $this->load->database();
        }

        public function getUsers(){
        	$this->db->select('*');
			$this->db->from('user');
			$query = $this->db->get();
			return $query->result_array();
        }

        public function addUser($name,$email,$password,$dob,$gender){
                	$this->db->set('user_name',$name);
                	$this->db->set('email',$email);
                	$this->db->set('password',$password);
                	$this->db->set('dob',$dob);
                	$this->db->set('gender',$gender);
			$insertion=$this->db->insert('user');
			// return $query->result_array();
        }

        public function geUserByID($user_id){
                        $this->db->select('*');
                        $this->db->from('users');
                        $this->db->where('user_id',$user_id);
                        $query = $this->db->get();
                        return $query->row(); 
        }

        public function getUserByEmail($email_id){
                        $this->db->select('*');
                        $this->db->from('users');
                        $this->db->where('email_id',$email_id);
                        $query = $this->db->get();
                        return $query->row(); 
        }

        public function insertUser($salutation,$name,$dob,$mobile,$email_id,$company_name,$city,$aviva_emp_id,$added_on){

                $user_email=$this->getUserByEmail($email_id);
                if($user_email){
                        $this->db->set('salutation',$salutation);
                        $this->db->set('name',$name);
                        $this->db->set('dob',$dob);
                        $this->db->set('mobile',$mobile);
                        $this->db->set('email_id',$email_id);
                        $this->db->set('company_name',$company_name);
                        $this->db->set('city',$city);
                        $this->db->set('aviva_emp_id',$aviva_emp_id);
                        $this->db->set('added_on',$added_on);
                        $this->db->where('user_id',$user_email->user_id);

                        $updation=$this->db->update('users');
                        if($updation==1){
                                return array('status'=>true,'message'=>'user updated','data'=>$this->geUserByID($user_email->user_id));
                        }else{
                                return array('status'=>false,'message'=>'something went wrong');
                        }
                }else{
                        $this->db->set('salutation',$salutation);
                        $this->db->set('name',$name);
                        $this->db->set('dob',$dob);
                        $this->db->set('mobile',$mobile);
                        $this->db->set('email_id',$email_id);
                        $this->db->set('company_name',$company_name);
                        $this->db->set('city',$city);
                        $this->db->set('aviva_emp_id',$aviva_emp_id);
                        $this->db->set('added_on',$added_on);

                        $insertion=$this->db->insert('users');
                        if($insertion==1){
                                $last_inserted_id=$this->db->insert_id();
                                return array('status'=>true,'message'=>'user registered','data'=>$this->geUserByID($last_inserted_id));  
                        }else{
                                return array('status'=>false,'message'=>'something went wrong');
                        }
                }                
        }

        public function getBusinessOwnerByID($bo_id){
                        $this->db->select('*');
                        $this->db->from('business_owner');
                        $this->db->where('bo_id',$bo_id);
                        $query = $this->db->get();
                        return $query->row(); 
        }

        public function saveBusinessOwner($user_id,$q1,$q1a,$q2,$q3,$q4,$q5,$q5a){
                        $this->db->set('user_id',$user_id);
                        $this->db->set('q1',$q1);
                        $this->db->set('q1a',$q1a);
                        $this->db->set('q2',$q2);
                        $this->db->set('q3',$q3);
                        $this->db->set('q4',$q4);
                        $this->db->set('q5',$q5);
                        $this->db->set('q5a',$q5a);


                        $insertion=$this->db->insert('business_owner');
                        if($insertion==1){
                                $last_inserted_id=$this->db->insert_id();
                                return array('status'=>true,'message'=>'data inserted','data'=>$this->getBusinessOwnerByID($last_inserted_id));  
                        }else{
                                return array('status'=>false,'message'=>'something went wrong');
                        }
        }

        public function getEmployerByID($emp_id){
                        $this->db->select('*');
                        $this->db->from('employer');
                        $this->db->where('emp_id',$emp_id);
                        $query = $this->db->get();
                        return $query->row(); 
        }

        public function saveEmployer($user_id,$q1,$q2,$q3,$q4,$q5,$q6){
                        $this->db->set('user_id',$user_id);
                        $this->db->set('q1',$q1);
                        $this->db->set('q2',$q2);
                        $this->db->set('q3',$q3);
                        $this->db->set('q4',$q4);
                        $this->db->set('q5',$q5);
                        $this->db->set('q6',$q6);


                        $insertion=$this->db->insert('employer');
                        if($insertion==1){
                                $last_inserted_id=$this->db->insert_id();
                                return array('status'=>true,'message'=>'data inserted','data'=>$this->getEmployerByID($last_inserted_id));  
                        }else{
                                return array('status'=>false,'message'=>'something went wrong');
                        }
        }

        public function getHOFBYID($hof_id){
                        $this->db->select('*');
                        $this->db->from('head_of_family');
                        $this->db->where('hof_id',$hof_id);
                        $query = $this->db->get();
                        return $query->row(); 
        }

        public function saveHOF($user_id,$q1,$q2,$q3,$q4,$q5,$q6,$q7,$q8,$q9,$q10){
                        $this->db->set('user_id',$user_id);
                        $this->db->set('q1',$q1);
                        $this->db->set('q2',$q2);
                        $this->db->set('q3',$q3);
                        $this->db->set('q4',$q4);
                        $this->db->set('q5',$q5);
                        $this->db->set('q6',$q6);
                        $this->db->set('q7',$q7);
                        $this->db->set('q8',$q8);
                        $this->db->set('q9',$q9);
                        $this->db->set('q10',$q10);


                        $insertion=$this->db->insert('head_of_family');
                        if($insertion==1){
                                $last_inserted_id=$this->db->insert_id();
                                return array('status'=>true,'message'=>'data inserted','data'=>$this->getHOFBYID($last_inserted_id));  
                        }else{
                                return array('status'=>false,'message'=>'something went wrong');
                        }
        }

}