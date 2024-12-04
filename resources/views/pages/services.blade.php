
@extends('layouts.app')

@section('content')
        <h1>{{$title}}</h1>
            <!-- Überprüft, ob es Services gibt, und listet sie auf -->

        @if(count($services)>0)
            <ul>
                            <!-- Schleife durch jedes Service in der Liste "services" -->

                @foreach ($services as $service)
                    <li>{{$service}}</li>
                @endforeach
            </ul>
        @endif
        <p>This is the services page</p>
@endsection
