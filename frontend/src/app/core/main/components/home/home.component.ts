import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilm, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-home',
    imports: [CommonModule, RouterModule, FontAwesomeModule],
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

    constructor(
        private readonly titleService: Title,
        private readonly metaService: Meta
    ) {}

    ngOnInit(): void {
        this.titleService.setTitle("MovieMator - Your Personal Cinematic Journey Tracker");

        this.metaService.addTags([
            { name: "description", content: "MovieMator helps you track, rate, review, and organize your movie watch history. Your personal companion for cinematic insights." },
            { name: "keywords", content: "MovieMator, movie tracker, movie diary, film log, watch history, film reviews, movie ratings, organize movies, personal movie collection" },
            { name: "author", content: "Tudor Orban" },
            { name: "robots", content: "index, follow" }, 
            
            // Open Graph
            { property: "og:title", content: "MovieMator - Your Personal Cinematic Journey Tracker" },
            { property: "og:description", content: "MovieMator helps you track, rate, review, and organize your movie watch history. Your personal companion for cinematic insights." },
            { property: "og:url", content: "https://www.moviemator.org/" },
            { property: "og:site_name", content: "MovieMator" },
            { property: "og:type", content: "website" },
            { property: "og:image", content: "https://www.moviemator.org/assets/images/Logo.png" },
            { property: "og:image:alt", content: "MovieMator app screenshot showing movie tracking features" },

            // Twitter Card
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:title", content: "MovieMator - Track, Rate & Organize Your Movies!" },
            { name: "twitter:description", content: "Effortlessly log, rate, and explore your cinematic journey with MovieMator. Start tracking today!" },
            { name: "twitter:image", content: "https://www.moviemator.org/assets/images/moviemator-twitter-card.jpg" }
        ]);
    }

    faPlus = faPlus;
    faFilm = faFilm;
}
