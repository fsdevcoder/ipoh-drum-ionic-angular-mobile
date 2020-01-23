import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'videoUrlSanitizer'
})

export class VideoUrlSanitizerPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }
    transform(url) {
        if (url.includes('youtube')) {
            url = url.replace('watch?v=', 'embed/');
        }
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
