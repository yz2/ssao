#include "CGL/CGL.h"
#include "CGL/viewer.h"

#include "application.h"

#include <unistd.h>

using namespace std;
using namespace CGL;

#define msg(s) cerr << "[PathTracer] " << s << endl;

void usage(const char* binaryName) {
  printf("Usage: %s [options] <scenefile>\n", binaryName);
  printf("Program Options:\n");
  printf("  -s  <INT>        Number of camera rays per pixel\n");
  printf("  -l  <INT>        Number of samples per area light\n");
  printf("  -x  <DOUBLE>     Ambient occlusion radius; must be > 0.0");
  printf("  -t  <INT>        Number of render threads\n");
  printf("  -f  <FILENAME>   Image (.png) file to save output to in windowless mode\n");
  printf("  -r  <INT> <INT>  Width and height of output image (if windowless)\n");
  printf("  -h               Print this help message\n");
  printf("\n");
}

int main( int argc, char** argv ) {

  // get the options
  AppConfig config; int opt;
  bool write_to_file = false;
  size_t w = 0, h = 0, x = static_cast<size_t>(-1), y = 0, dx = 0, dy = 0;
  string filename, cam_settings;
  while ( (opt = getopt(argc, argv, "f:r:p:s:l:t:c:m:")) != -1 ) {  // for each option...
    switch ( opt ) {
      case 'f':
          write_to_file = true;
          filename  = string(optarg);
          break;
      case 'r':
          w = static_cast<size_t>(atoi(argv[optind - 1]));
          h = static_cast<size_t>(atoi(argv[optind]));
          optind++;
          break;
      case 'p':
          x = static_cast<size_t>(atoi(argv[optind - 1]));
          y = static_cast<size_t>(atoi(argv[optind - 0]));
          dx = static_cast<size_t>(atoi(argv[optind + 1]));
          dy = static_cast<size_t>(atoi(argv[optind + 2]));
          optind += 3;
          break;
      case 's':
          config.pathtracer_ns_aa = static_cast<size_t>(atoi(optarg));
          break;
      case 'l':
          config.pathtracer_ns_area_light = static_cast<size_t>(atoi(optarg));
          break;
      case 't':
          config.pathtracer_num_threads = static_cast<size_t>(atoi(optarg));
          break;
      case 'c':
          cam_settings = string(optarg);
          break;
      case 'm':
          config.pathtracer_max_t = stod(optarg);
          break;
      default:
          usage(argv[0]);
          return 1;
      }
  }

  // print usage if no argument given
  if (optind >= argc) {
    usage(argv[0]);
    return 1;
  }

  string sceneFilePath = argv[optind];
  msg("Input scene file: " << sceneFilePath);
  string sceneFile = sceneFilePath.substr(sceneFilePath.find_last_of('/')+1);
  sceneFile = sceneFile.substr(0,sceneFile.find(".dae"));
  config.pathtracer_filename = sceneFile;

  // parse scene
  Collada::SceneInfo *sceneInfo = new Collada::SceneInfo();
  if (Collada::ColladaParser::load(sceneFilePath.c_str(), sceneInfo) < 0) {
    delete sceneInfo;
    exit(0);
  }

  // create application
  Application *app  = new Application(config, !write_to_file);

  // write straight to file without opening a window if -f option provided
  if (write_to_file) {
    app->init();
    app->load(sceneInfo);
    delete sceneInfo;

    if (w && h)
      app->resize(w, h);

    if (cam_settings != "")
      app->load_camera(cam_settings);

    app->render_to_file(filename, x, y, dx, dy);
    return 0;
  }

  // create viewer
  Viewer viewer = Viewer();

  // set renderer
  viewer.set_renderer(app);

  // init viewer
  viewer.init();

  // load scene 
  app->load(sceneInfo);

  delete sceneInfo;

  if (w && h)
    viewer.resize(w, h);
    
  if (cam_settings != "")
    app->load_camera(cam_settings);

  // start viewer
  viewer.start();

  return 0;

}
