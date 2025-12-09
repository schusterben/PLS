
@extends('layouts.app') <!-- Erweitert das Hauptlayout 'app' -->

@section('content')
    <h1>{{$title}}</h1><!-- Anzeige des Titels, der dynamisch übergeben wird -->
    <p> This is the laravel app </p><!-- Beschreibungstext -->
@endsection
