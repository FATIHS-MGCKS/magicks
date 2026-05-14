<?php
declare(strict_types=1);

const CONTACT_RECIPIENT = 'hello@magicks.de';
const MAX_FIELD_LENGTH = 4000;

function respond(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, max-age=0');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function env_value(string $key, ?string $fallback = null): ?string
{
    $value = getenv($key);
    if ($value === false || $value === '') {
        return $fallback;
    }

    return $value;
}

function text_field(array $input, string $key): string
{
    $value = $input[$key] ?? '';
    if (!is_string($value)) {
        return '';
    }

    return trim(substr($value, 0, MAX_FIELD_LENGTH));
}

function safe_header_value(string $value): string
{
    return trim(str_replace(["\r", "\n"], '', $value));
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Allow: POST, OPTIONS');
    respond(204, ['ok' => true]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST, OPTIONS');
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (strpos(strtolower($contentType), 'application/json') === false) {
    respond(415, ['ok' => false, 'error' => 'unsupported_media_type']);
}

$rawBody = file_get_contents('php://input');
if ($rawBody === false || strlen($rawBody) > 20000) {
    respond(400, ['ok' => false, 'error' => 'invalid_payload']);
}

$input = json_decode($rawBody, true);
if (!is_array($input)) {
    respond(400, ['ok' => false, 'error' => 'invalid_json']);
}

// Honeypot: real users never fill this hidden field.
if (text_field($input, 'website') !== '') {
    respond(400, ['ok' => false, 'error' => 'spam_detected']);
}

$name = text_field($input, 'name');
$email = text_field($input, 'email');
$company = text_field($input, 'company');
$projectKindLabel = text_field($input, 'projectKindLabel');
$message = text_field($input, 'message');
$source = text_field($input, 'source') ?: '/kontakt';
$timestamp = gmdate('c');

if ($name === '' || $message === '' || strlen($message) < 10) {
    respond(422, ['ok' => false, 'error' => 'validation_failed']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'error' => 'validation_failed']);
}

if ($projectKindLabel === '') {
    $projectKindLabel = 'Noch offen / Beratung';
}

$subjectName = $company !== '' ? $company : ($name !== '' ? $name : 'Projekt');
$subject = safe_header_value('Anfrage MAGICKS — ' . $subjectName);

$bodyLines = [
    'Neue Anfrage über magicks.de/kontakt',
    '',
    'Name: ' . $name,
    $company !== '' ? 'Unternehmen: ' . $company : null,
    'E-Mail: ' . $email,
    'Projektart: ' . $projectKindLabel,
    'Zeitpunkt: ' . $timestamp,
    'Quelle: ' . $source,
    '',
    'Nachricht:',
    $message,
];

$body = implode("\n", array_values(array_filter($bodyLines, static function ($line) {
    return $line !== null;
})));

$fromAddress = env_value('MAGICKS_MAIL_FROM', CONTACT_RECIPIENT);
$replyTo = safe_header_value($email);

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: MAGICKS Website <' . safe_header_value($fromAddress) . '>',
    'Reply-To: ' . $replyTo,
    'X-Mailer: PHP/' . phpversion(),
];

$sent = mail(CONTACT_RECIPIENT, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    respond(500, ['ok' => false, 'error' => 'send_failed']);
}

respond(200, ['ok' => true]);
