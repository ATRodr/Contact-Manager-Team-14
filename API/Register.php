<?php
  $inData = json_decode(file_get_contents('php://input'), true);

  $firstName = $inData["firstName"];
  $lastName = $inData["lastName"];
  $phone = $inData["phone"];
  $email = $inData["email"];
  $userID = $inData["userID"];

  $conn = new mysqli("localhost", "Master", "Password123", "ContactManager");
  if ($conn->connect_error)
  {
    returnWithError($conn->connect_error);
  }
  else
  {
    $stmt = $conn->prepare("INSERT into Users (firstName, lastName, phone, email, userID) VALUES(?,?,?,?,?)");
		$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userID);
    $stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
  }

  function sendResultInfoAsJson($obj)
  {
    header('Content-type: application/json');
    echo $obj;
  }

  function returnWithError($err)
  {
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
  }
 ?>
