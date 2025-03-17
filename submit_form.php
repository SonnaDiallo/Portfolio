<?php
// Afficher les données du formulaire (pour débogage)
print_r($_POST);

// Connexion à la base de données
$host = 'localhost';
$dbname = 'contact_form';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connexion à la base de données réussie !";

    // Récupérer les données du formulaire
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    // Préparer la requête SQL
    $stmt = $conn->prepare("INSERT INTO messages (name, email, subject, message) VALUES (:name, :email, :subject, :message)");
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':subject', $subject);
    $stmt->bindParam(':message', $message);

    // Exécuter la requête
    $stmt->execute();

    // Rediriger l'utilisateur vers une page de confirmation
    header('Location: thank_you.html');
} catch (PDOException $e) {
    echo "Erreur : " . $e->getMessage();
}
?>