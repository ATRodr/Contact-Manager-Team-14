<?php

    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $userID = $inData["userID"];
    $contactID = $inData ["contactID"];

    $conn = new mysqli("localhost", "Master", "Password123", "ContactManager");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName= ?, LastName= ?, Phone= ?, Email= ? WHERE UserID= ? AND ID = ?");
        $stmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $userID, $contactID);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithError("");
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
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
