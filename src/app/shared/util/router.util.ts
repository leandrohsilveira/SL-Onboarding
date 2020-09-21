import { UrlSegment, ActivatedRoute } from '@angular/router';

export class RouterUtil {
  static urlFromRootToParent(route: ActivatedRoute) {
    return route.snapshot.parent.pathFromRoot
      .map((r) => r.url)
      .reduce((acc, item) => [...acc, ...item], <UrlSegment[]>[])
      .map((seg) => seg.path);
  }
}
