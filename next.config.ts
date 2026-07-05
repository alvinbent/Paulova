const stitchRoutes = [
  ["/", "/stitch-assets/pages/home.html"],
  ["/home-acceso-privado", "/stitch-assets/pages/home-acceso-privado.html"],
  ["/tratamientos", "/stitch-assets/pages/tratamientos.html"],
  ["/limpieza-facial-profunda-hydrash", "/stitch-assets/pages/limpieza-facial-profunda-hydrash.html"],
  ["/toxina-botulinica", "/stitch-assets/pages/toxina-botulinica.html"],
  ["/quienes-somos", "/stitch-assets/pages/quienes-somos.html"],
  ["/contacto", "/stitch-assets/pages/contacto.html"],
  ["/international-patients", "/stitch-assets/pages/international-patients.html"],
  ["/blog", "/stitch-assets/pages/blog.html"],
].map(([source, destination]) => ({ source, destination }));

const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: stitchRoutes,
    };
  },
};

export default nextConfig;
