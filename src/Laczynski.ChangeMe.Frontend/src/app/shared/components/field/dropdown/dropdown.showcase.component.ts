import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { DropdownComponent } from './dropdown.component';
import { DropdownItem, DropdownGroup } from './dropdown.component';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-dropdown-showcase',

  imports: [DropdownComponent, FormsModule, JsonPipe, TableOfContentComponent],
  template: `
    <div class="showcase showcase--responsive showcase__with-toc">
      <app-table-of-content
        [sticky]="true"
        [offsetTop]="20"
        containerSelector=".showcase-content"
        [minLevel]="1"
        [maxLevel]="2"
      />
      <div class="showcase-content">
        <h1 class="showcase__title">Dropdown Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Dropdown (Horizontal Select) component built with Fluent 2
        Design System. All variants are responsive and accessible.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-dropdown
              label="Single Select"
              [items]="basicItems"
              mode="single"
              variant="filled"
              placeholder="Select an option"
              helpText="Choose one option from the list"
            />
          </div>
          <div class="showcase__item">
            <app-dropdown
              label="Multi Select"
              [items]="basicItems"
              mode="multi"
              variant="filled"
              placeholder="Select options"
              helpText="Choose multiple options"
            />
          </div>
        </div>
      </div>

      <!-- With Icons -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">With Icons</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-dropdown
              label="Countries"
              [items]="countriesWithIcons"
              mode="single"
              variant="filled"
              placeholder="Select a country"
            />
          </div>
          <div class="showcase__item">
            <app-dropdown
              label="Actions"
              [items]="actionsWithIcons"
              mode="single"
              variant="filled"
              placeholder="Select an action"
            />
          </div>
        </div>
      </div>

      <!-- With Groups -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Grouped Items</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-dropdown
              label="File Browser"
              [groups]="fileGroups"
              mode="single"
              variant="filled"
              placeholder="Browse files"
            />
          </div>
          <div class="showcase__item">
            <app-dropdown
              label="Team Members"
              [groups]="teamGroups"
              mode="multi"
              variant="filled"
              placeholder="Select team members"
            />
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-dropdown
              label="Small Dropdown"
              [items]="basicItems"
              size="small"
              variant="filled"
              placeholder="Small size"
            />
          </div>
          <div class="showcase__item">
            <app-dropdown
              label="Medium Dropdown (Default)"
              [items]="basicItems"
              size="medium"
              variant="filled"
              placeholder="Medium size"
            />
          </div>
          <div class="showcase__item">
            <app-dropdown
              label="Large Dropdown"
              [items]="basicItems"
              size="large"
              variant="filled"
              placeholder="Large size"
            />
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-dropdown
              label="Normal State"
              [items]="basicItems"
              state="info"
              variant="filled"
              helpText="This is a normal dropdown"
            />
          </div>
          <div class="showcase__item">
            <app-dropdown
              label="Error State"
              [items]="basicItems"
              state="error"
              variant="filled"
              errorText="Please select a valid option"
            />
          </div>
          <div class="showcase__item">
            <app-dropdown
              label="Warning State"
              [items]="basicItems"
              state="warning"
              variant="filled"
              warningText="This selection will affect other fields"
            />
          </div>
          <div class="showcase__item">
            <app-dropdown
              label="Success State"
              [items]="basicItems"
              state="success"
              variant="filled"
              successText="Valid selection"
            />
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-dropdown
              label="Disabled Dropdown"
              [items]="basicItems"
              [disabled]="true"
              variant="filled"
              helpText="This dropdown is disabled"
            />
          </div>
          <div class="showcase__item">
            <app-dropdown
              label="Required Dropdown"
              [items]="basicItems"
              [required]="true"
              variant="filled"
              helpText="This field is required"
            />
          </div>
          <div class="showcase__item">
            <app-dropdown
              label="Clearable Dropdown"
              [items]="basicItems"
              [clearable]="true"
              variant="filled"
              helpText="You can clear the selection"
            />
          </div>
        </div>
      </div>

      <!-- Searchable -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Searchable Dropdown</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-dropdown
              label="Search Countries"
              [items]="longCountryList"
              [searchable]="true"
              [clearable]="true"
              variant="filled"
              placeholder="Type to search..."
              maxHeight="200px"
            />
          </div>
          <div class="showcase__item">
            <app-dropdown
              label="Search Cities"
              [items]="cityList"
              [searchable]="true"
              mode="multi"
              variant="filled"
              placeholder="Search cities..."
            />
          </div>
        </div>
      </div>

      <!-- Variant Options -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Variant Options</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-dropdown
              label="Filled Variant"
              [items]="basicItems"
              variant="filled"
              placeholder="Filled style"
            />
          </div>
          <div class="showcase__item">
            <app-dropdown
              label="Underlined Variant"
              [items]="basicItems"
              variant="underlined"
              placeholder="Underlined style"
            />
          </div>
          <div class="showcase__item">
            <app-dropdown
              label="Filled Gray Variant"
              [items]="basicItems"
              variant="filled-gray"
              placeholder="Filled gray style"
            />
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Form Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-dropdown
                label="Country"
                [items]="countriesWithIcons"
                [(ngModel)]="formData.country"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                variant="filled"
                placeholder="Select your country"
              />
              <app-dropdown
                label="Preferred Languages"
                [items]="languageList"
                [(ngModel)]="formData.languages"
                [ngModelOptions]="{ standalone: true }"
                mode="multi"
                variant="filled"
                placeholder="Select languages"
              />
              <app-dropdown
                label="Department"
                [groups]="departmentGroups"
                [(ngModel)]="formData.department"
                [ngModelOptions]="{ standalone: true }"
                variant="filled"
                placeholder="Select department"
              />
              <div class="showcase__form-output">
                <strong>Selected Values:</strong>
                <pre>{{ formData | json }}</pre>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Inline Edit Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Inline Edit</h2>
        <p class="showcase__section__description">
          Inline edit allows users to edit dropdown selection directly by clicking on it. Changes are
          saved on blur or Enter, and can be cancelled with Escape.
        </p>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Basic Inline Edit</h3>
            <app-dropdown
              label="Country"
              [items]="basicItems"
              mode="single"
              [inlineEdit]="true"
              [(ngModel)]="inlineEditValue1"
              [ngModelOptions]="{ standalone: true }"
              placeholder="Click to edit..."
              helpText="Click on the text to edit. Press Enter to save or Esc to cancel."
            />
            <p style="font-size: 12px; color: #666; margin-top: 8px;">
              Current value: <strong>{{ inlineEditValue1 || '(empty)' }}</strong>
            </p>
          </div>
          <div class="showcase__item">
            <h3>Inline Edit with Default Value</h3>
            <app-dropdown
              label="Language"
              [items]="languageList"
              mode="single"
              [inlineEdit]="true"
              [(ngModel)]="inlineEditValue2"
              [ngModelOptions]="{ standalone: true }"
              placeholder="Enter language..."
              helpText="Field with pre-filled value"
            />
            <p style="font-size: 12px; color: #666; margin-top: 8px;">
              Current value: <strong>{{ inlineEditValue2 || '(empty)' }}</strong>
            </p>
          </div>
          <div class="showcase__item">
            <h3>Multi-Select Inline Edit</h3>
            <app-dropdown
              label="Preferred Languages"
              [items]="languageList"
              mode="multi"
              [inlineEdit]="true"
              [(ngModel)]="inlineEditValue3"
              [ngModelOptions]="{ standalone: true }"
              placeholder="Click to select languages..."
              helpText="Select multiple languages. Click to edit. Press Enter to save or Esc to cancel."
            />
            <p style="font-size: 12px; color: #666; margin-top: 8px;">
              Current value: <strong>{{ inlineEditValue3?.length ? inlineEditValue3.join(', ') : '(empty)' }}</strong>
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  `,
})
export class DropdownShowcaseComponent {
  formData = {
    country: '',
    languages: [] as string[],
    department: '',
  };

  basicItems: DropdownItem[] = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
    { value: '4', label: 'Option 4', disabled: true },
    { value: '5', label: 'Option 5' },
  ];

  countriesWithIcons: DropdownItem[] = [
    {
      value: 'us',
      label: 'United States',
      icon: 'star',
    },
    {
      value: 'uk',
      label: 'United Kingdom',
      icon: 'star',
    },
    {
      value: 'fr',
      label: 'France',
      icon: 'star',
    },
  ];

  actionsWithIcons: DropdownItem[] = [
    {
      value: 'edit',
      label: 'Edit',
      icon: 'star',
    },
    {
      value: 'delete',
      label: 'Delete',
      icon: 'star',
    },
    {
      value: 'download',
      label: 'Download',
      icon: 'star',
    },
  ];

  fileGroups: DropdownGroup[] = [
    {
      header: 'Recent Files',
      items: [
        { value: 'file1', label: 'Document.pdf' },
        { value: 'file2', label: 'Presentation.pptx' },
        { value: 'file3', label: 'Spreadsheet.xlsx' },
      ],
    },
    {
      header: 'Shared Files',
      items: [
        { value: 'file4', label: 'Team Report.docx' },
        { value: 'file5', label: 'Budget 2025.xlsx' },
      ],
    },
  ];

  teamGroups: DropdownGroup[] = [
    {
      header: 'Engineering',
      items: [
        { value: 'eng1', label: 'John Doe' },
        { value: 'eng2', label: 'Jane Smith' },
        { value: 'eng3', label: 'Bob Johnson' },
      ],
    },
    {
      header: 'Design',
      items: [
        { value: 'des1', label: 'Alice Williams' },
        { value: 'des2', label: 'Charlie Brown' },
      ],
    },
  ];

  departmentGroups: DropdownGroup[] = [
    {
      header: 'Technology',
      items: [
        { value: 'eng', label: 'Engineering' },
        { value: 'qa', label: 'Quality Assurance' },
        { value: 'devops', label: 'DevOps' },
      ],
    },
    {
      header: 'Business',
      items: [
        { value: 'sales', label: 'Sales' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'hr', label: 'Human Resources' },
      ],
    },
  ];

  longCountryList: DropdownItem[] = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' },
    { value: 'br', label: 'Brazil' },
    { value: 'ar', label: 'Argentina' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' },
    { value: 'it', label: 'Italy' },
    { value: 'es', label: 'Spain' },
    { value: 'pl', label: 'Poland' },
    { value: 'ua', label: 'Ukraine' },
    { value: 'jp', label: 'Japan' },
    { value: 'cn', label: 'China' },
    { value: 'in', label: 'India' },
    { value: 'au', label: 'Australia' },
  ];

  cityList: DropdownItem[] = [
    { value: 'nyc', label: 'New York City' },
    { value: 'la', label: 'Los Angeles' },
    { value: 'chicago', label: 'Chicago' },
    { value: 'houston', label: 'Houston' },
    { value: 'phoenix', label: 'Phoenix' },
    { value: 'philadelphia', label: 'Philadelphia' },
    { value: 'san-antonio', label: 'San Antonio' },
    { value: 'san-diego', label: 'San Diego' },
    { value: 'dallas', label: 'Dallas' },
    { value: 'san-jose', label: 'San Jose' },
  ];

  languageList: DropdownItem[] = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pl', label: 'Polish' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
  ];

  // Inline edit showcase values
  inlineEditValue1 = '';
  inlineEditValue2 = 'en';
  inlineEditValue3: string[] = [];
}
