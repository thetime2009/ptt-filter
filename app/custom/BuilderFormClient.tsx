'use client';

import { useState } from 'react';
import FilterVisualizer from './FilterVisualizer';
import styles from './custom-builder.module.css';

interface BuilderFormClientProps {
  locale: 'th' | 'en' | 'zh';
  submitAction: (payload: any) => Promise<{ success: boolean; error?: string }>;
}

export default function BuilderFormClient({ locale, submitAction }: BuilderFormClientProps) {
  // Option choices states
  const [category, setCategory] = useState('dust');
  const [capTop, setCapTop] = useState('through');
  const [capBottom, setCapBottom] = useState('closed');
  const [meshOuter, setMeshOuter] = useState('round');
  const [meshInner, setMeshInner] = useState('round');
  const [media, setMedia] = useState('polyester');
  const [mediaColor, setMediaColor] = useState('#ea580c'); // orange
  const [meshNumber, setMeshNumber] = useState('100');
  const [seal, setSeal] = useState('sponge');
  
  // Dimensions
  const [outerDiameter, setOuterDiameter] = useState('325');
  const [innerDiameter, setInnerDiameter] = useState('215');
  const [height, setHeight] = useState('660');
  const [quantity, setQuantity] = useState('10');

  // Contact Information
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Accordion active step index
  const [activeStep, setActiveStep] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name,
      email,
      phone,
      message,
      specs: {
        category,
        capTop,
        capBottom,
        meshOuter,
        meshInner,
        media,
        mediaDetails: media === 'cellulose' ? mediaColor : media === 'mesh' ? `Mesh #${meshNumber}` : 'Polyester White',
        seal,
        outerDiameter: `${outerDiameter} mm`,
        innerDiameter: `${innerDiameter} mm`,
        height: `${height} mm`,
        quantity: `${quantity} ชิ้น`
      }
    };

    const res = await submitAction(payload);
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } else {
      setError(res.error || 'การส่งข้อมูลล้มเหลว');
    }
  };

  if (success) {
    return (
      <div className={`${styles.successCard} glass`}>
        <div className={styles.successIcon}>✓</div>
        <h2>{locale === 'th' ? 'ส่งแบบโครงสร้างไส้กรองสำเร็จ!' : 'Inquiry Submitted Successfully!'}</h2>
        <p>
          {locale === 'th'
            ? 'วิศวกรของเราได้รับแบบไส้กรองที่คุณประกอบเรียบร้อยแล้ว เราจะทำการตรวจสอบแบบ ประเมินราคา และติดต่อกลับหาคุณภายใน 24 ชั่วโมง'
            : 'Our engineers have received your custom configuration. We will inspect specifications and get back to you with a quote within 24 hours.'}
        </p>
        <button onClick={() => setSuccess(false)} className={styles.resetBtn}>
          {locale === 'th' ? 'ออกแบบชิ้นส่วนใหม่อีกครั้ง' : 'Design Another Filter'}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.builderGrid}>
      {/* LEFT: SVG Visualizer */}
      <div className={styles.visualizerPanel}>
        <FilterVisualizer
          category={category}
          capTop={capTop}
          capBottom={capBottom}
          meshOuter={meshOuter}
          meshInner={meshInner}
          media={media}
          mediaColor={media === 'cellulose' ? mediaColor : ''}
          seal={seal}
        />
      </div>

      {/* RIGHT: Selector Form Panels */}
      <div className={`${styles.formPanel} glass`}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          
          {/* Step 1: Filter Type */}
          <div className={`${styles.stepSection} ${activeStep === 0 ? styles.stepActive : ''}`}>
            <button type="button" className={styles.stepHeader} onClick={() => setActiveStep(0)}>
              <span className={styles.stepNum}>1</span>
              <span>ประเภทการกรอง (Application Category)</span>
              <span className={styles.stepArrow}>{activeStep === 0 ? '▲' : '▼'}</span>
            </button>
            
            {activeStep === 0 && (
              <div className={styles.stepBody}>
                <p className={styles.stepInstructions}>เลือกเป้าหมายการกรองของไส้กรองอุตสาหกรรมชิ้นนี้:</p>
                <div className={styles.optionsGrid}>
                  {[
                    { id: 'dust', label: '🌪️ ฝุ่นละออง (Dust)' },
                    { id: 'oil', label: '🛢️ น้ำมันไฮดรอลิก (Oil)' },
                    { id: 'odor', label: '💨 กลิ่น / คาร์บอน (Odor)' },
                    { id: 'smoke', label: '🔥 ควันไอเสีย (Smoke)' },
                    { id: 'sediment', label: '🛠️ ตะกอนและสารแขวนลอย (Sediment)' },
                    { id: 'other', label: '⚙️ งานสั่งทำอื่นๆ (Other)' }
                  ].map(opt => (
                    <label key={opt.id} className={`${styles.optionLabel} ${category === opt.id ? styles.optionActive : ''}`}>
                      <input type="radio" name="category" value={opt.id} checked={category === opt.id} onChange={() => setCategory(opt.id)} className={styles.radioInput} />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Caps and Seals */}
          <div className={`${styles.stepSection} ${activeStep === 1 ? styles.stepActive : ''}`}>
            <button type="button" className={styles.stepHeader} onClick={() => setActiveStep(1)}>
              <span className={styles.stepNum}>2</span>
              <span>ส่วนประกอบฝาและซีล (Caps & Sealing)</span>
              <span className={styles.stepArrow}>{activeStep === 1 ? '▲' : '▼'}</span>
            </button>

            {activeStep === 1 && (
              <div className={styles.stepBody}>
                <div className={styles.subGroup}>
                  <label className={styles.subLabel}>1. รูปแบบฝาบน (Upper Cap)</label>
                  <div className={styles.optionsGrid}>
                    <label className={`${styles.optionLabel} ${capTop === 'through' ? styles.optionActive : ''}`}>
                      <input type="radio" name="capTop" value="through" checked={capTop === 'through'} onChange={() => setCapTop('through')} className={styles.radioInput} />
                      ฝาทะลุ (Through-hole Cap)
                    </label>
                    <label className={`${styles.optionLabel} ${capTop === 'other' ? styles.optionActive : ''}`}>
                      <input type="radio" name="capTop" value="other" checked={capTop === 'other'} onChange={() => setCapTop('other')} className={styles.radioInput} />
                      ฝาปิดทึบ / ฝาอื่นๆ (Solid Cap)
                    </label>
                  </div>
                </div>

                <div className={styles.subGroup} style={{ marginTop: '20px' }}>
                  <label className={styles.subLabel}>2. รูปแบบฝาล่าง (Lower Cap)</label>
                  <div className={styles.optionsGrid}>
                    <label className={`${styles.optionLabel} ${capBottom === 'closed' ? styles.optionActive : ''}`}>
                      <input type="radio" name="capBottom" value="closed" checked={capBottom === 'closed'} onChange={() => setCapBottom('closed')} className={styles.radioInput} />
                      ฝาปิดทึบ (Closed Cap)
                    </label>
                    <label className={`${styles.optionLabel} ${capBottom === 'through' ? styles.optionActive : ''}`}>
                      <input type="radio" name="capBottom" value="through" checked={capBottom === 'through'} onChange={() => setCapBottom('through')} className={styles.radioInput} />
                      ฝาทะลุ (Through-hole Cap)
                    </label>
                    <label className={`${styles.optionLabel} ${capBottom === 'other' ? styles.optionActive : ''}`}>
                      <input type="radio" name="capBottom" value="other" checked={capBottom === 'other'} onChange={() => setCapBottom('other')} className={styles.radioInput} />
                      ฝาอื่นๆ (Other Cap)
                    </label>
                  </div>
                </div>

                <div className={styles.subGroup} style={{ marginTop: '20px' }}>
                  <label className={styles.subLabel}>3. ปะเก็นยาง / ซีลติดขอบฝา (Seals)</label>
                  <div className={styles.optionsGrid}>
                    <label className={`${styles.optionLabel} ${seal === 'sponge' ? styles.optionActive : ''}`}>
                      <input type="radio" name="seal" value="sponge" checked={seal === 'sponge'} onChange={() => setSeal('sponge')} className={styles.radioInput} />
                      ซีลฟองน้ำสีดำ (Black Sponge Seal)
                    </label>
                    <label className={`${styles.optionLabel} ${seal === 'oil' ? styles.optionActive : ''}`}>
                      <input type="radio" name="seal" value="oil" checked={seal === 'oil'} onChange={() => setSeal('oil')} className={styles.radioInput} />
                      ซีลยางกันน้ำมันสีส้ม (Oil-resistant Seal)
                    </label>
                    <label className={`${styles.optionLabel} ${seal === 'oring' ? styles.optionActive : ''}`}>
                      <input type="radio" name="seal" value="oring" checked={seal === 'oring'} onChange={() => setSeal('oring')} className={styles.radioInput} />
                      โอริงยางตามขนาด (Rubber O-ring)
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Media */}
          <div className={`${styles.stepSection} ${activeStep === 2 ? styles.stepActive : ''}`}>
            <button type="button" className={styles.stepHeader} onClick={() => setActiveStep(2)}>
              <span className={styles.stepNum}>3</span>
              <span>วัสดุกรอง (Filtration Media)</span>
              <span className={styles.stepArrow}>{activeStep === 2 ? '▲' : '▼'}</span>
            </button>

            {activeStep === 2 && (
              <div className={styles.stepBody}>
                <p className={styles.stepInstructions}>เลือกชนิดของใยกรองอากาศหรือตะแกรงกรองของชิ้นงาน:</p>
                <div className={styles.optionsGrid}>
                  <label className={`${styles.optionLabel} ${media === 'polyester' ? styles.optionActive : ''}`}>
                    <input type="radio" name="media" value="polyester" checked={media === 'polyester'} onChange={() => setMedia('polyester')} className={styles.radioInput} />
                    ใย Polyester สีขาว (Standard)
                  </label>
                  <label className={`${styles.optionLabel} ${media === 'cellulose' ? styles.optionActive : ''}`}>
                    <input type="radio" name="media" value="cellulose" checked={media === 'cellulose'} onChange={() => setMedia('cellulose')} className={styles.radioInput} />
                    กระดาษ Cellulose สีต่างๆ
                  </label>
                  <label className={`${styles.optionLabel} ${media === 'mesh' ? styles.optionActive : ''}`}>
                    <input type="radio" name="media" value="mesh" checked={media === 'mesh'} onChange={() => setMedia('mesh')} className={styles.radioInput} />
                    ตะแกรงกรองลวดละเอียด (#Mesh)
                  </label>
                </div>

                {/* If Cellulose is selected, show color palette */}
                {media === 'cellulose' && (
                  <div className={styles.colorPalette} style={{ marginTop: '16px' }}>
                    <p className={styles.subLabel} style={{ marginBottom: '8px' }}>เลือกสีกระดาษ Cellulose:</p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {[
                        { hex: '#ea580c', label: 'ส้ม' },
                        { hex: '#eab308', label: 'เหลือง' },
                        { hex: '#2563eb', label: 'น้ำเงิน' },
                        { hex: '#16a34a', label: 'เขียว' }
                      ].map(color => (
                        <button
                          key={color.hex}
                          type="button"
                          className={`${styles.colorBtn} ${mediaColor === color.hex ? styles.colorActive : ''}`}
                          style={{ backgroundColor: color.hex }}
                          title={color.label}
                          onClick={() => setMediaColor(color.hex)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* If Wire Mesh is selected, show mesh input */}
                {media === 'mesh' && (
                  <div style={{ marginTop: '16px' }}>
                    <label className={styles.subLabel}>ระบุเบอร์ตะแกรงกรองที่ต้องการ (เช่น 30 - 1000 Mesh):</label>
                    <input
                      type="text"
                      value={meshNumber}
                      onChange={(e) => setMeshNumber(e.target.value)}
                      className={styles.textInput}
                      placeholder="e.g. 200 Mesh"
                      style={{ marginTop: '8px', maxWidth: '200px' }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 4: Meshes */}
          <div className={`${styles.stepSection} ${activeStep === 3 ? styles.stepActive : ''}`}>
            <button type="button" className={styles.stepHeader} onClick={() => setActiveStep(3)}>
              <span className={styles.stepNum}>4</span>
              <span>ประเภทตะแกรงเหล็กประคอง (Metal Meshes)</span>
              <span className={styles.stepArrow}>{activeStep === 3 ? '▲' : '▼'}</span>
            </button>

            {activeStep === 3 && (
              <div className={styles.stepBody}>
                <div className={styles.subGroup}>
                  <label className={styles.subLabel}>1. ตะแกรงเหล็กประคองรอบนอก (Outer Mesh)</label>
                  <div className={styles.optionsGrid}>
                    {[
                      { id: 'round', label: '⚪ รูกลมสับหว่าง' },
                      { id: 'diamond', label: '🔷 รูข้าวหลามตัด' },
                      { id: 'mesh', label: '🕸️ ตะแกรงลวดถักละเอียด' }
                    ].map(opt => (
                      <label key={opt.id} className={`${styles.optionLabel} ${meshOuter === opt.id ? styles.optionActive : ''}`}>
                        <input type="radio" name="meshOuter" value={opt.id} checked={meshOuter === opt.id} onChange={() => setMeshOuter(opt.id)} className={styles.radioInput} />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className={styles.subGroup} style={{ marginTop: '20px' }}>
                  <label className={styles.subLabel}>2. ตะแกรงเหล็กประคองแกนใน (Inner Mesh)</label>
                  <div className={styles.optionsGrid}>
                    {[
                      { id: 'round', label: '⚪ รูกลมสับหว่าง' },
                      { id: 'diamond', label: '🔷 รูข้าวหลามตัด' },
                      { id: 'square', label: '⬜ รูสี่เหลี่ยมด้านเท่า' },
                      { id: 'mesh', label: '🕸️ ตะแกรงลวดถักละเอียด' }
                    ].map(opt => (
                      <label key={opt.id} className={`${styles.optionLabel} ${meshInner === opt.id ? styles.optionActive : ''}`}>
                        <input type="radio" name="meshInner" value={opt.id} checked={meshInner === opt.id} onChange={() => setMeshInner(opt.id)} className={styles.radioInput} />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 5: Dimensions & Submit */}
          <div className={`${styles.stepSection} ${activeStep === 4 ? styles.stepActive : ''}`}>
            <button type="button" className={styles.stepHeader} onClick={() => setActiveStep(4)}>
              <span className={styles.stepNum}>5</span>
              <span>ระบุขนาดและรายละเอียดผู้ติดต่อ (Submit Details)</span>
              <span className={styles.stepArrow}>{activeStep === 4 ? '▲' : '▼'}</span>
            </button>

            {activeStep === 4 && (
              <div className={styles.stepBody}>
                {/* Custom Dimensions inputs */}
                <p className={styles.subLabel} style={{ marginBottom: '8px' }}>ระบุขนาดสินค้าที่ต้องการสั่งผลิต (มิลลิเมตร):</p>
                <div className={styles.dimensionsRow}>
                  <div className={styles.dimensionInputGroup}>
                    <label>เส้นผ่านศูนย์กลางนอก (OD)</label>
                    <input type="number" value={outerDiameter} onChange={(e) => setOuterDiameter(e.target.value)} className={styles.textInput} placeholder="OD (mm)" required />
                  </div>
                  <div className={styles.dimensionInputGroup}>
                    <label>เส้นผ่านศูนย์กลางใน (ID)</label>
                    <input type="number" value={innerDiameter} onChange={(e) => setInnerDiameter(e.target.value)} className={styles.textInput} placeholder="ID (mm)" required />
                  </div>
                  <div className={styles.dimensionInputGroup}>
                    <label>ความสูง (H)</label>
                    <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className={styles.textInput} placeholder="Height (mm)" required />
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 120px', gap: '16px' }}>
                  <div className={styles.dimensionInputGroup}>
                    <label>รายละเอียดประกอบการสั่งทำเพิ่มเติม</label>
                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className={styles.textInput} placeholder="เช่น ความต้านทานความร้อน หรือเกรดสแตนเลส" />
                  </div>
                  <div className={styles.dimensionInputGroup}>
                    <label>จำนวน (ชิ้น)</label>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={styles.textInput} required min="1" />
                  </div>
                </div>

                <div className={styles.divider}></div>

                {/* Contact forms */}
                <p className={styles.subLabel} style={{ marginBottom: '8px' }}>รายละเอียดสำหรับการติดต่อกลับ:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className={styles.dimensionInputGroup}>
                      <label>ชื่อผู้ติดต่อ / บริษัท *</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={styles.textInput} placeholder="เช่น บริษัท กขค จำกัด" required />
                    </div>
                    <div className={styles.dimensionInputGroup}>
                      <label>เบอร์โทรศัพท์ติดต่อ</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={styles.textInput} placeholder="เช่น 081-234-5678" />
                    </div>
                  </div>
                  <div className={styles.dimensionInputGroup}>
                    <label>อีเมลผู้ติดต่อ *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.textInput} placeholder="เช่น user@company.com" required />
                  </div>
                </div>

                {error && <div style={{ color: '#ef4444', marginTop: '16px', fontSize: '14px' }}>⚠️ {error}</div>}

                <button type="submit" disabled={loading} className={styles.submitBtn}>
                  {loading ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูลเพื่อขอใบเสนอราคา (Request Quote)'}
                </button>
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
