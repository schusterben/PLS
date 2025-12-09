<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * Die zentrale Basisklasse für alle Controller der Anwendung.
 *
 * Diese Klasse stellt grundlegende Funktionalitäten bereit, die alle anderen Controller
 * in der Anwendung erben können. Durch die Verwendung dieser Basisklasse wird sichergestellt,
 * dass in allen Controllern einheitliche Methoden für Autorisierungs- und Validierungslogik
 * verfügbar sind.
 *
 * Traits:
 * - AuthorizesRequests: Bietet Methoden, um Benutzerrechte und -zugriffe zu überprüfen.
 * - ValidatesRequests: Ermöglicht die Validierung von Benutzereingaben in einer konsistenten Weise.
 *
 * Diese Klasse wird von spezifischen Controllern (z. B. BodyPartController, LoginController) verwendet,
 * um sicherzustellen, dass alle Authorisierungs- und Validierungslogiken zentral und wartbar sind.
 */
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}
