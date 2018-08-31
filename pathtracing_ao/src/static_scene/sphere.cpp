#include "sphere.h"

#include <cmath>

#include  "../bsdf.h"
#include "../misc/sphere_drawing.h"

namespace CGL { namespace StaticScene {

bool Sphere::test(const Ray& r, double& t1, double& t2) const {

  // TODO (Part 1.4):
  // Implement ray - sphere intersection test.
  // Return true if there are intersections and writing the
  // smaller of the two intersection times in t1 and the larger in t2.

  double a = dot(r.d, r.d);
  double b = dot(2*(r.o - o), r.d);
  double c = dot(r.o - o, r.o - o) - pow(this->r, 2);

  double right_side = pow(pow(b, 2) - 4*a*c, 0.5);
  vector<double> results = {(-b + right_side)/2*a,
                            (-b - right_side)/2*a};

  t1 = *min_element(begin(results), end(results));
  t2 = *max_element(begin(results), end(results));

  return (t1 >= r.min_t and t2 <= r.max_t);
}

bool Sphere::intersect(const Ray& r) const {

  // TODO (Part 1.4):
  // Implement ray - sphere intersection.
  // Note that you might want to use the the Sphere::test helper here.
  double t1, t2;
  return test(r, t1, t2);
}

bool Sphere::intersect(const Ray& r, Intersection *i) const {

  // TODO (Part 1.4):
  // Implement ray - sphere intersection.
  // Note again that you might want to use the the Sphere::test helper here.
  // When an intersection takes place, the Intersection data should be updated
  // correspondingly.
  double t1, t2;
  if (not test(r, t1, t2)) { return false; }

  r.max_t = t1;
  i->t = t1;
  i->n = r.o + r.d * t1 - this->o;
  i->n.normalize();
  i->bsdf = get_bsdf();
  i->primitive = this;
  return true;
}

void Sphere::draw(const Color& c) const {
  Misc::draw_sphere_opengl(o, r, c);
}

void Sphere::drawOutline(const Color& c) const {
    //Misc::draw_sphere_opengl(o, r, c);
}


} // namespace StaticScene
} // namespace CGL
