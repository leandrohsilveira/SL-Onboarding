import { ActivatedRoute } from '@angular/router';

export class RouterUtil {
  static urlFromRootToParent(route: ActivatedRoute): string[] {
    return route.snapshot.parent.pathFromRoot
      .map((r) => r.url)
      .reduce((acc, item) => [...acc, ...item], [])
      .map((seg) => seg.path);
  }
}
