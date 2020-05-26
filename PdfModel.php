<?php

class PdfModel extends CI_Model
{

	public function __construct()
	{
		$this->load->database();
	}

	public function getUser($user_id)
	{
		$this->db->select('*');
		$this->db->from('users');
		$this->db->where('user_id', $user_id);
		$query = $this->db->get();
		return $query->row();
	}

	public function getAdminUser($user_name,$password)
	{
		$this->db->select('*');
		$this->db->from('admin');
		$this->db->where('user_name', $user_name);
		$this->db->where('password', $password);
		$query = $this->db->get();
		return $query->row();
	}


	public function getAllUsers()
	{
		$this->db->select('*');
		$this->db->from('users');
		$query = $this->db->get();
		return $query->result();
	}

	public function getAllUsersFROMTO($from, $to)
	{
		$this->db->select('*');
		$this->db->from('users');
		$this->db->where('DATE(added_on)>=', $from);
		$this->db->where('DATE(added_on)<=', $to);
		$query = $this->db->get();
//		echo "query:-".$this->db->last_query();
		return $query->result();
	}

	public function getBusinessByUserID($user_id)
	{
		$this->db->select('*');
		$this->db->from('business_owner');
		$this->db->where('user_id', $user_id);
		$query = $this->db->get();
		return $query->row();
	}

	public function getEmployerByUserID($user_id)
	{
		$this->db->select('*');
		$this->db->from('employer');
		$this->db->where('user_id', $user_id);
		$query = $this->db->get();
		return $query->row();
	}

	public function getHOFByUserID($user_id)
	{
		$this->db->select('*');
		$this->db->from('head_of_family');
		$this->db->where('user_id', $user_id);
		$query = $this->db->get();
		return $query->row();
	}

	public function getHighestAge()
	{
		$this->db->select('age');
		$this->db->from('premium_rate');
		$this->db->order_by('id', 'DESC');
		$query = $this->db->get();
		return $query->row();
	}

	public function getPremiumData($age)
	{
		$this->db->select('*');
		$this->db->from('premium_rate');
		$this->db->where('age', $age);
		$query = $this->db->get();
		return $query->row();
	}


}
