"use client";

import { useState } from "react";
import { Plus, Mail, Clock, GripVertical, Trash2 } from "lucide-react";

export default function SequenceBuilder({ campaignId }: { campaignId: string }) {
  // Mock sequence state
  const [steps, setSteps] = useState([
    {
      id: "step-1",
      dayDelay: 1,
      channel: "EMAIL",
      subject: "Quick question regarding {{companyName}}",
      body: "Hi {{firstName}},\n\nI noticed that..."
    }
  ]);

  const addStep = () => {
    setSteps([
      ...steps,
      {
        id: `step-${Date.now()}`,
        dayDelay: 3,
        channel: "EMAIL",
        subject: "",
        body: ""
      }
    ]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold">Sequence Steps</h2>
          <p className="text-sm text-muted-foreground mt-1">Configure your automated follow-ups.</p>
        </div>
        <button 
          onClick={addStep}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Step
        </button>
      </div>

      <div className="space-y-6 relative">
        {/* Timeline connection line */}
        <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-border z-0" />

        {steps.map((step, index) => (
          <div key={step.id} className="relative z-10 flex gap-6">
            
            {/* Timeline Node */}
            <div className="flex flex-col items-center pt-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary shadow-sm">
                <Mail className="h-5 w-5" />
              </div>
              {index < steps.length - 1 && steps[index + 1] && (
                <div className="mt-4 flex items-center bg-background border rounded-full px-2 py-1 text-xs font-medium shadow-sm">
                  <Clock className="w-3 h-3 mr-1" />
                  Wait {steps[index + 1]?.dayDelay} Days
                </div>
              )}
            </div>

            {/* Step Card */}
            <div className="flex-1 rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b flex items-center justify-between">
                <div className="flex items-center text-sm font-medium">
                  <GripVertical className="h-4 w-4 mr-2 text-muted-foreground cursor-move" />
                  Step {index + 1}: {step.channel}
                </div>
                <button 
                  onClick={() => removeStep(index)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Subject Line</label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Enter subject line..."
                    defaultValue={step.subject}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Email Body</label>
                    <div className="text-[10px] text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                      &#123;&#123;firstName&#125;&#125; &#123;&#123;companyName&#125;&#125;
                    </div>
                  </div>
                  <textarea
                    className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Hi {{firstName}}, ..."
                    defaultValue={step.body}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {steps.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/10">
            <Mail className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-medium text-foreground">No sequence steps</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Add your first email step to get started.</p>
            <button 
              onClick={addStep}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Step
            </button>
          </div>
        )}
      </div>

      {steps.length > 0 && (
        <div className="mt-8 flex justify-end">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 shadow-sm">
            Save Sequence
          </button>
        </div>
      )}
    </div>
  );
}
