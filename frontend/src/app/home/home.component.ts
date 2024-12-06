import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="home-container">
      <aside class="sidebar">
        <nav>
          <ul>
            <li><a routerLink="/dashboard">Dashboard</a></li>
            <li><a routerLink="/projects">Projects</a></li>
            <li><a routerLink="/tasks">Tasks</a></li>
            <li><a routerLink="/members">Members</a></li>
          </ul>
        </nav>
      </aside>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {}
