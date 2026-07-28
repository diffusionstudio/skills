import { createEffect, createSignal, onCleanup } from "solid-js";
import { useTicker } from "@diffusionstudio/jsx";

const SHADER = /* wgsl */ `
  @group(0) @binding(0) var<uniform> time: f32;

  struct VSOut {
    @builtin(position) position: vec4f,
    @location(0) local: vec2f,
  }

  @vertex
  fn vs(@builtin(vertex_index) i: u32) -> VSOut {
    var corners = array<vec2f, 3>(vec2f(0.0, 0.75), vec2f(-0.8, -0.6), vec2f(0.8, -0.6));
    var out: VSOut;
    out.position = vec4f(corners[i], 0.0, 1.0);
    out.local = corners[i];
    return out;
  }

  @fragment
  fn fs(in: VSOut) -> @location(0) vec4f {
    // cosine palette; each corner leads the cycle by a different phase
    let phase = in.local.x * 1.5 + in.local.y;
    let rgb = 0.5 + 0.5 * cos(time + phase + vec3f(0.0, 2.094, 4.188));
    return vec4f(rgb, 1.0);
  }
`;

export default function WebgpuTriangle() {
  const { time } = useTicker();
  const [gpu, setGpu] = createSignal();

  const setup = async (el) => {
    const adapter = await navigator.gpu?.requestAdapter();
    if (!adapter) throw new Error("WebGPU is not available");
    const device = await adapter.requestDevice();

    const context = el.getContext("webgpu");
    if (!context) throw new Error("No webgpu context on the surface canvas");
    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: "premultiplied" });

    const module = device.createShaderModule({ code: SHADER });
    const pipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: { module, entryPoint: "vs" },
      fragment: { module, entryPoint: "fs", targets: [{ format }] },
    });

    const uniforms = device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniforms } }],
    });

    setGpu({ device, context, pipeline, uniforms, bindGroup });
  };

  createEffect(() => {
    const g = gpu();
    const t = time();
    if (!g) return;

    g.device.queue.writeBuffer(g.uniforms, 0, new Float32Array([t]));

    const encoder = g.device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: g.context.getCurrentTexture().createView(),
          clearValue: { r: 0.04, g: 0.05, b: 0.08, a: 1 },
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    });
    pass.setPipeline(g.pipeline);
    pass.setBindGroup(0, g.bindGroup);
    pass.draw(3);
    pass.end();
    g.device.queue.submit([encoder.finish()]);
  });

  onCleanup(() => gpu()?.device.destroy());

  return (
    <rect scene="example-webgpu" name="WebGPU triangle" width={960} height={540} fill="#0b0d12">
      <surface x={0} y={0} width={960} height={540} ref={setup} />
    </rect>
  );
}
