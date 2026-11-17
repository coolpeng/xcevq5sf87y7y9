/* 线上轻量版 runtime cache：HTML 优先走网络，题库分片/图片优先走缓存 */
const C='xc-cafc45bc8b';
self.addEventListener('install',function(){ self.skipWaiting(); });
self.addEventListener('activate',function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET') return;
  var u; try{ u=new URL(e.request.url); }catch(err){ return; }
  if(u.origin!==location.origin) return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(function(r){
      var c=r.clone(); caches.open(C).then(function(k){ k.put(e.request,c); }); return r;
    }).catch(function(){ return caches.match(e.request); }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function(r){
    if(r) return r;
    return fetch(e.request).then(function(resp){
      if(resp && resp.ok){ var c=resp.clone(); caches.open(C).then(function(k){ k.put(e.request,c); }); }
      return resp;
    });
  }));
});
