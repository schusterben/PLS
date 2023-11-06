<!DOCTYPE html>
<html>
<head>
    <title>Personenliste</title>
    <meta http-equiv="refresh" content="60"> 
</head>
<body>

<h2>Alle Personen:</h2>

@if ($persons->isEmpty())
    <p>Keine Personen gefunden.</p>
@else
    <table border="1">
        <thead>
            <tr>
                <th>Nummer</th>
                <th>geht</th>
                <th>Atmung</th>
                <th>stillbare Blutung</th>
                <th>Puls</th>
                <th>Triagefarbe</th>
                <th>Dringend</th>
                <th>Kontaminiert</th>
                <th>erfasst</th>
                <th>letztes update</th>
                
            </tr>
        </thead>
        <tbody>
            @foreach ($persons as $person)
                <tr>
                    <td>{{ $person->Nummer }}</td>
                    <td>{{ $person->geht ? 'Ja' : 'Nein' }}</td>
                    <td>{{ $person->AtmungSuffizient? 'Ja' : 'Nein' }}</td>
                    <td>{{ $person->Blutung? 'Ja' : 'Nein' }}</td>
                    <td>{{ $person->RadialispulsTastbar? 'Ja' : 'Nein' }}</td>
                    <td>
                        @php
                            $backgroundColor = 'white';  // Standardwert
                            switch ($person->Triagefarbe) {
                                 case 'gelb':
                                    $backgroundColor = 'yellow';
                                    break;
                                case 'rot':
                                    $backgroundColor = 'red';
                                    break;
                                case 'grün':
                                    $backgroundColor = 'green';
                                    break;
                                case 'blau':
                                    $backgroundColor = 'blue';
                                    break;
                                case 'schwarz':
                                    $backgroundColor = 'black';
                                    break;
                            }
                        @endphp

                        <div style="background-color: {{ $backgroundColor }};">
                            {{ $person->Triagefarbe }}
                        </div>
                        <td>{{ $person->dringend? 'Ja' : 'Nein' }}</td>
                        <td>{{ $person->kontaminiert? 'Ja' : 'Nein' }}</td>
                        <td>{{ $person->created_at }}</td>
                        <td>{{ $person->updated_at }}</td>
                    
                    </td>
                    
                    <!-- Sie können hier weitere Datenfelder nach Ihren Bedürfnissen hinzufügen -->
                </tr>
            @endforeach
        </tbody>
    </table>
@endif

</body>
</html>
